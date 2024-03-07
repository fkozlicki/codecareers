import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from '../db';
import { User, sessions, users } from '../db/schema';
import { Lucia } from 'lucia';
import { GitHub } from 'arctic';
import dotenv from 'dotenv';

dotenv.config();

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: process.env.NODE_ENV === 'production',
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

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: Omit<User, 'id'>;
	}
}
