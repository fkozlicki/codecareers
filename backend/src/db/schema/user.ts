import { relations } from 'drizzle-orm';
import { integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { companies } from './company.js';
import { applications } from './application.js';
import { chatUsers } from './chatUser.js';

export const users = pgTable('user', {
	id: uuid('id').primaryKey().defaultRandom(),
	firstName: text('first_name'),
	lastName: text('last_name'),
	githubId: integer('github_id'),
	username: text('username'),
	email: text('email').unique(),
	password: text('password'),
	avatar: text('avatar'),
});

export const usersRelations = relations(users, ({ many }) => ({
	companies: many(companies),
	applications: many(applications),
	chatUsers: many(chatUsers),
}));

export type User = typeof users.$inferSelect;
