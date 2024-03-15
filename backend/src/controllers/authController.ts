import { Request, Response } from 'express';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { db } from '../db';
import { users } from '../db/schema';
import {
	OAuth2RequestError,
	generateCodeVerifier,
	generateState,
} from 'arctic';
import { github, google, lucia } from '../lib/lucia';
import { parseCookies, serializeCookie } from 'oslo/cookie';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const credentialsSignUpSchema = z.object({
	body: z.object({
		email: z.string(),
		password: z.string(),
		firstName: z.string(),
		lastName: z.string(),
	}),
});

type CredentialsSignUpSchema = z.infer<typeof credentialsSignUpSchema>;

export const handleCredentialsSignUp = async (req: Request, res: Response) => {
	const { email, firstName, lastName, password } =
		req.body as CredentialsSignUpSchema['body'];

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
		res.status(500).json({ message: 'Server error' });
	}
};

export const credentialsSignInSchema = z.object({
	body: z.object({
		email: z.string(),
		password: z.string(),
	}),
});

type CredentialsSignInSchema = z.infer<typeof credentialsSignInSchema>;

export const handleCredentialsSignIn = async (req: Request, res: Response) => {
	const { email, password } = req.body as CredentialsSignInSchema['body'];

	const user = await db.query.users.findFirst({
		where: eq(users.email, email),
	});

	if (!user || !user.password) {
		return res.status(400).json({ message: 'Invalid credentials' });
	}

	const validPassword = await new Argon2id().verify(user.password, password);

	if (!validPassword) {
		return res.status(400).json({ message: 'Invalid credentials' });
	}

	const session = await lucia.createSession(user.id, {});

	res
		.appendHeader(
			'Set-Cookie',
			lucia.createSessionCookie(session.id).serialize()
		)
		.status(200)
		.json({ message: 'Signed in' });
};

const codeVerifier = generateCodeVerifier();
export const handleGoogleSignIn = async (_: Request, res: Response) => {
	const state = generateState();
	const url = await google.createAuthorizationURL(state, codeVerifier, {
		scopes: ['profile', 'email'],
	});
	res
		.appendHeader(
			'Set-Cookie',
			serializeCookie('google_oauth_state', state, {
				path: '/',
				secure: process.env.NODE_ENV === 'production',
				httpOnly: true,
				maxAge: 60 * 10,
				sameSite: 'lax',
			})
		)
		.redirect(url.toString());
};

export const handleGoogleCallback = async (req: Request, res: Response) => {
	const code = req.query.code?.toString() ?? null;
	const state = req.query.state?.toString() ?? null;
	const storedState =
		parseCookies(req.headers.cookie ?? '').get('google_oauth_state') ?? null;

	if (!code || !state || !storedState || state !== storedState) {
		res.status(400).end();
		return;
	}

	try {
		const tokens = await google.validateAuthorizationCode(code, codeVerifier);
		const googleUserResponse = await fetch(
			'https://openidconnect.googleapis.com/v1/userinfo',
			{
				headers: {
					Authorization: `Bearer ${tokens.accessToken}`,
				},
			}
		);
		const googleUser: GoogleUser = await googleUserResponse.json();

		const existingUser = await db.query.users.findFirst({
			where: eq(users.email, googleUser.email),
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
				firstName: googleUser.given_name,
				lastName: googleUser.family_name,
				email: googleUser.email,
				avatar: googleUser.picture,
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
			res.status(400).end();
			return;
		}
		res.status(500).end();
		return;
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
				avatar: githubUser.avatar_url,
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
				avatar: users.avatar,
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
	avatar_url: string;
}

interface GoogleUser {
	given_name: string;
	family_name: string;
	email: string;
	picture: string;
}
