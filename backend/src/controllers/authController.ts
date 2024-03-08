import { Request, Response } from 'express';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { db } from '../db';
import { users } from '../db/schema';
import { OAuth2RequestError, generateState } from 'arctic';
import { github, lucia } from '../lib/lucia';
import { parseCookies, serializeCookie } from 'oslo/cookie';
import { eq } from 'drizzle-orm';

export const handleCredentialsSignUp = async (req: Request, res: Response) => {
	const email: string | null = req.body.email ?? null;
	const password: string | null = req.body.password ?? null;
	const firstName: string | null = req.body.password ?? null;
	const lastName: string | null = req.body.password ?? null;

	if (!email || !password || !firstName || !lastName) {
		res.status(400).json({ message: 'Invalid credentials' });
		return;
	}

	const hashedPassword = await new Argon2id().hash(password);

	try {
		await db.insert(users).values({
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
};

export const handleGithubSignIn = async (_: Request, res: Response) => {
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
};

export const handleGithubCallback = async (req: Request, res: Response) => {
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

		const existingUser = await db.query.users.findFirst({
			where: eq(users.githubId, githubUser.id),
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
		const [user] = await db
			.insert(users)
			.values({
				username: githubUser.login,
				githubId: githubUser.id,
			})
			.returning();
		const session = await lucia.createSession(user.id, {});

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
};

export const handleSession = async (req: Request, res: Response) => {
	if (!res.locals.user) {
		res.status(200).json({});
		return;
	}

	const user = (
		await db
			.select({
				id: users.id,
				firstName: users.firstName,
				lastName: users.lastName,
				username: users.username,
			})
			.from(users)
			.where(eq(users.id, res.locals.user.id))
	)[0];
	res.status(200).json({ user });
};

export const handleLogout = async (_: Request, res: Response) => {
	if (!res.locals.session) {
		return res.status(401).end();
	}
	await lucia.invalidateSession(res.locals.session.id);
	return res
		.setHeader('Set-Cookie', lucia.createBlankSessionCookie().serialize())
		.redirect('http://localhost:5173');
};

interface GitHubUser {
	id: number;
	login: string;
}
