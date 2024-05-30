import { relations } from 'drizzle-orm';
import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { jobOfferSkills } from './jobOfferSkill';

export const skills = pgTable('skill', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	public: boolean('public').notNull(),
});

export const skillsRelations = relations(skills, ({ many }) => ({
	jobOfferSkills: many(jobOfferSkills),
}));
