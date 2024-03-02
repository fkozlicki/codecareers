import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { OAuth2RequestError, generateState } from 'arctic';
import { github, lucia } from './auth';
import { parseCookies, serializeCookie } from 'oslo/cookie';
import { db } from './db';
import { userTable } from './db/schema';
import { eq } from 'drizzle-orm';
import { generateId, verifyRequestOrigin } from 'lucia';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded());

app.use(
	cors({
		credentials: true,
		origin: 'http://localhost:5173',
	})
);

app.use((req, res, next) => {
	if (req.method === 'GET') {
		return next();
	}
	const originHeader = req.headers.origin ?? null;
	const hostHeader = req.headers.host ?? null;
	if (
		!originHeader ||
		!hostHeader ||
		!verifyRequestOrigin(originHeader, [hostHeader])
	) {
		return res.status(403).end();
	}
	return next();
});

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

app.get('/', (req: Request, res: Response) => {
	res.send('Express + TS Server');
});

app.get('/login/github', async (_, res) => {
	console.log('HITTING GITHUB LOGIN!!!!!!!!!');
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
	console.log('HITTING GITHUB CALLBACK!!!!!!!!!');

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
			return res.appendHeader(
				'Set-Cookie',
				lucia.createSessionCookie(session.id).serialize()
			);
		}

		const userId = generateId(15);
		await db.insert(userTable).values({
			id: userId,
			username: githubUser.login,
			githubId: githubUser.id,
		});
		const session = await lucia.createSession(userId, {});

		return res.appendHeader(
			'Set-Cookie',
			lucia.createSessionCookie(session.id).serialize()
		);
	} catch (e) {
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

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});

interface GitHubUser {
	id: number;
	login: string;
}
