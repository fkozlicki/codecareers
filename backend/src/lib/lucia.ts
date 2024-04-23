import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from '../db/index.js';
import { User, sessions, users } from '../db/schema.js';
import { Lucia } from 'lucia';
import { GitHub, Google } from 'arctic';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			sameSite: 'none' as 'lax',
			secure: true,
		},
	},
	getUserAttributes: (attributes) => {
		return {
			githubId: attributes.githubId,
			username: attributes.username,
			email: attributes.email,
		};
	},
});

export const github = new GitHub(
	process.env.GITHUB_CLIENT_ID!,
	process.env.GITHUB_CLIENT_SECRET!
);

export const google = new Google(
	process.env.GOOGLE_CLIENT_ID!,
	process.env.GOOGLE_CLIENT_SECRET!,
	`${process.env.API_URI}/login/google/callback`
);

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: Omit<User, 'id'>;
	}
}
