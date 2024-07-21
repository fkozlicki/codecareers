import { relations } from 'drizzle-orm';
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { users } from './user.js';
import { jobOffers } from './jobOffer.js';

export const companies = pgTable('company', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	phoneNumber: text('phone_number').notNull(),
	ownerId: uuid('owner_id').notNull(),
	description: text('description'),
	avatarUrl: text('avatar_url'),
	backgroundUrl: text('background_url'),
});

export type Company = typeof companies.$inferSelect;

export const companiesRelations = relations(companies, ({ one, many }) => ({
	owner: one(users, {
		fields: [companies.ownerId],
		references: [users.id],
	}),
	jobOffers: many(jobOffers),
}));
