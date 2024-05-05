import {
	OAuth2RequestError,
	generateCodeVerifier,
	generateState,
} from 'arctic';
import { Request, Response } from 'express';
import { parseCookies, serializeCookie } from 'oslo/cookie';
import { Argon2id } from 'oslo/password';
import { github, google, lucia } from '../lib/lucia.js';
import * as userService from '../services/user.service.js';
import { SignUpSchema } from '../validators/auth.js';
import { User } from '../db/schema.js';

export const signUp = async (
	req: Request<{}, {}, SignUpSchema['body']>,
	res: Response
) => {
	const { email, firstName, lastName, password } = req.body;

	try {
		const existingUser = await userService.findUserByEmail(email);

		if (existingUser) {
			return res
				.status(409)
				.json({ message: 'User with this email already exists' });
		}

		const hashedPassword = await new Argon2id().hash(password);

		await userService.createUser({
			email,
			firstName,
			lastName,
			password: hashedPassword,
		});

		res.status(201).json({ message: 'Signed up successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

export const credentialsSignIn = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	try {
		const user = await userService.findUserByEmail(email);

		if (!user?.password) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		const validPassword = await new Argon2id().verify(user.password, password);

		if (!validPassword) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		const session = await lucia.createSession(user.id, {});

		delete (user as Partial<User>).password;

		res
			.appendHeader(
				'Set-Cookie',
				lucia.createSessionCookie(session.id).serialize()
			)
			.status(200)
			.json({ user });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

const codeVerifier = generateCodeVerifier();

export const googleSignIn = async (_: Request, res: Response) => {
	const state = generateState();
	const url = await google.createAuthorizationURL(state, codeVerifier, {
		scopes: ['profile', 'email'],
	});
	res
		.appendHeader(
			'Set-Cookie',
			serializeCookie('google_oauth_state', state, {
				path: '/',
				secure: true,
				httpOnly: true,
				maxAge: 60 * 10,
				sameSite: 'none',
			})
		)
		.redirect(url.toString());
};

export const googleCallback = async (req: Request, res: Response) => {
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
		const googleUser = (await googleUserResponse.json()) as GoogleUser;

		const existingUser = await userService.findUserByEmail(googleUser.email);

		if (existingUser) {
			const session = await lucia.createSession(existingUser.id, {});
			return res
				.appendHeader(
					'Set-Cookie',
					lucia.createSessionCookie(session.id).serialize()
				)
				.redirect(process.env.CLIENT_URI ?? 'http://localhost:5173');
		}
		const user = await userService.createUser({
			firstName: googleUser.given_name,
			lastName: googleUser.family_name,
			email: googleUser.email,
			avatar: googleUser.picture,
		});
		const session = await lucia.createSession(user.id, {});

		return res
			.appendHeader(
				'Set-Cookie',
				lucia.createSessionCookie(session.id).serialize()
			)
			.redirect(process.env.CLIENT_URI ?? 'http://localhost:5173');
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

export const githubSignIn = async (_: Request, res: Response) => {
	const state = generateState();
	const url = await github.createAuthorizationURL(state);
	res
		.appendHeader(
			'Set-Cookie',
			serializeCookie('github_oauth_state', state, {
				path: '/',
				secure: true,
				httpOnly: true,
				maxAge: 60 * 10,
				sameSite: 'none',
			})
		)
		.redirect(url.toString());
};

export const githubCallback = async (req: Request, res: Response) => {
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
		const githubUser = (await githubUserResponse.json()) as GitHubUser;

		const existingUser = await userService.findUserByGithubId(githubUser.id);

		if (existingUser) {
			const session = await lucia.createSession(existingUser.id, {});
			return res
				.appendHeader(
					'Set-Cookie',
					lucia.createSessionCookie(session.id).serialize()
				)
				.redirect(process.env.CLIENT_URI ?? 'http://localhost:5173');
		}
		const user = await userService.createUser({
			username: githubUser.login,
			githubId: githubUser.id,
			avatar: githubUser.avatar_url,
		});
		const session = await lucia.createSession(user.id, {});

		return res
			.appendHeader(
				'Set-Cookie',
				lucia.createSessionCookie(session.id).serialize()
			)
			.redirect(process.env.CLIENT_URI ?? 'http://localhost:5173');
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

export const getSession = async (req: Request, res: Response) => {
	if (!res.locals.user) {
		res.status(200).json({});
		return;
	}

	const user = await userService.findUserById(res.locals.user.id);

	if (!user) {
		return res.status(404).json({ message: 'User not found' });
	}

	const { password, ...rest } = user;

	res.status(200).json({ user: rest });
};

export const logout = async (_: Request, res: Response) => {
	if (!res.locals.session) {
		return res.status(401).end();
	}
	await lucia.invalidateSession(res.locals.session.id);
	return res
		.setHeader('Set-Cookie', lucia.createBlankSessionCookie().serialize())
		.redirect(process.env.CLIENT_URI ?? 'http://localhost:5173');
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
