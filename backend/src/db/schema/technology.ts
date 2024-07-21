import { relations } from 'drizzle-orm';
import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { jobOfferTechnologies } from './jobOfferTechnology.js';

export const technologies = pgTable('technology', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	public: boolean('public').notNull(),
});

export const technologiesRelations = relations(technologies, ({ many }) => ({
	jobOfferTechnologies: many(jobOfferTechnologies),
}));
