import { OAuth2RequestError, generateState } from 'arctic';
import cors from 'cors';
import dotenv from 'dotenv';
import { eq } from 'drizzle-orm';
import express, { NextFunction, Request, Response } from 'express';
import { generateId } from 'lucia';
import { parseCookies, serializeCookie } from 'oslo/cookie';
import { github, lucia } from './lib/lucia';
import { db } from './db';
import { userTable } from './db/schema';
import { Argon2id } from 'oslo/password';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(
	cors({
		credentials: true,
		origin: 'http://localhost:5173',
	})
);

app.use(async (req, res, next) => {
	const sessionId = lucia.readSessionCookie(req.headers.cookie ?? '');

	if (!sessionId) {
		res.locals.user = null;
		res.locals.session = null;
		return next();
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		res.appendHeader(
			'Set-Cookie',
			lucia.createSessionCookie(session.id).serialize()
		);
	}
	if (!session) {
		res.appendHeader(
			'Set-Cookie',
			lucia.createBlankSessionCookie().serialize()
		);
	}
	res.locals.session = session;
	res.locals.user = user;
	return next();
});

const protectRoute = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!res.locals.session) {
		res.status(401).json({ message: 'Auth required' });
		return;
	}

	next();
};

app.get('/', protectRoute, (req: Request, res: Response) => {
	res.json({ message: 'Express + TS Server', user: res.locals.user });
});

app.post('/signup', async (req: Request, res: Response) => {
	const email: string | null = req.body.email ?? null;
	const password: string | null = req.body.password ?? null;
	const firstName: string | null = req.body.password ?? null;
	const lastName: string | null = req.body.password ?? null;

	if (!email || !password || !firstName || !lastName) {
		res.status(400).json({ message: 'Invalid credentials' });
		return;
	}

	const hashedPassword = await new Argon2id().hash(password);
	const userId = generateId(15);

	try {
		await db.insert(userTable).values({
			id: userId,
			email,
			password: hashedPassword,
			firstName,
			lastName,
		});

		res.status(201).json({ message: 'Signed up successfully' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Server error' });
	}
});

app.get('/login/github', async (_, res) => {
	const state = generateState();
	const url = await github.createAuthorizationURL(state);
	res
		.appendHeader(
			'Set-Cookie',
			serializeCookie('github_oauth_state', state, {
				path: '/',
				secure: process.env.NODE_ENV === 'production',
				httpOnly: true,
				maxAge: 60 * 10,
				sameSite: 'lax',
			})
		)
		.redirect(url.toString());
});

app.get('/login/github/callback', async (req, res) => {
	const code = req.query.code?.toString() ?? null;
	const state = req.query.state?.toString() ?? null;
	const storedState =
		parseCookies(req.headers.cookie ?? '').get('github_oauth_state') ?? null;

	if (!code || !state || !storedState || state !== storedState) {
		console.log(code, state, storedState);
		res.status(400).end();
		return;
	}

	try {
		const tokens = await github.validateAuthorizationCode(code);

		const githubUserResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`,
			},
		});
		const githubUser: GitHubUser = await githubUserResponse.json();

		const existingUser = await db.query.userTable.findFirst({
			where: eq(userTable.githubId, githubUser.id),
		});

		if (existingUser) {
			const session = await lucia.createSession(existingUser.id, {});
			return res
				.appendHeader(
					'Set-Cookie',
					lucia.createSessionCookie(session.id).serialize()
				)
				.redirect('http://localhost:5173');
		}
		const userId = generateId(15);
		await db.insert(userTable).values({
			id: userId,
			username: githubUser.login,
			githubId: githubUser.id,
		});
		const session = await lucia.createSession(userId, {});

		return res
			.appendHeader(
				'Set-Cookie',
				lucia.createSessionCookie(session.id).serialize()
			)
			.redirect('http://localhost:5173');
	} catch (e) {
		console.error(e);
		if (
			e instanceof OAuth2RequestError &&
			e.message === 'bad_verification_code'
		) {
			// invalid code
			res.status(400).end();
			return;
		}
		res.status(500).end();
		return;
	}
});

app.post('/logout', async (_, res) => {
	if (!res.locals.session) {
		return res.status(401).end();
	}
	await lucia.invalidateSession(res.locals.session.id);
	return res
		.setHeader('Set-Cookie', lucia.createBlankSessionCookie().serialize())
		.json({
			message: 'Logged out successfully',
		});
});

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});

interface GitHubUser {
	id: number;
	login: string;
}
