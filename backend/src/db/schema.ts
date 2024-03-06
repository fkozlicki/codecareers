import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('user', {
	id: text('id').primaryKey(),
	firstName: text('first_name'),
	lastName: text('last_name'),
	githubId: integer('github_id'),
	username: text('username'),
	email: text('email').unique(),
	password: text('password'),
});

export const usersRelations = relations(users, ({ many }) => ({
	companies: many(companies),
}));

export type User = typeof users.$inferSelect;

export const sessions = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date',
	}).notNull(),
});

export const companies = pgTable('company', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	phoneNumber: text('phone_number').notNull(),
	ownerId: text('owner_id').notNull(),
	description: text('description'),
	avatarUrl: text('avatar_url'),
	backgroundUrl: text('background_url'),
});

export const companiesRelations = relations(companies, ({ one }) => ({
	owner: one(users, {
		fields: [companies.ownerId],
		references: [users.id],
	}),
}));
