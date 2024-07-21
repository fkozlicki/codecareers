import { relations } from 'drizzle-orm';
import {
	boolean,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core';
import { jobOfferSkills } from './jobOfferSkill.js';
import { jobOfferTechnologies } from './jobOfferTechnology.js';
import { applications } from './application.js';
import { companies } from './company.js';

export const levelEnum = pgEnum('level', ['junior', 'mid', 'senior']);
export const employmentTypeEnum = pgEnum('employment_type', [
	'b2b',
	'permanent',
	'mandate',
	'internship',
	'task',
]);
export const workTypeEnum = pgEnum('work_type', [
	'full_time',
	'part_time',
	'internship',
	'freelance',
]);
export const currencyEnum = pgEnum('currency', ['pln', 'gbp', 'eur', 'usd']);

export const jobOffers = pgTable('job_offer', {
	id: uuid('id').primaryKey().defaultRandom(),
	position: text('position').notNull(),
	description: text('description').notNull(),
	level: levelEnum('level').notNull(),
	employmentType: employmentTypeEnum('employment_type').notNull(),
	workType: workTypeEnum('work_type').notNull(),
	salaryFrom: integer('salary_from').notNull(),
	salaryTo: integer('salary_to').notNull(),
	salaryCurrency: currencyEnum('currency').notNull(),
	companyId: uuid('company_id').notNull(),
	createdAt: timestamp('created_at', {
		withTimezone: true,
		mode: 'date',
	})
		.notNull()
		.defaultNow(),
	published: boolean('published').notNull().default(false),
	deleted: boolean('deleted').notNull().default(false),
});

export const jobOffersRelations = relations(jobOffers, ({ many, one }) => ({
	jobOfferSkills: many(jobOfferSkills),
	jobOfferTechnologies: many(jobOfferTechnologies),
	applications: many(applications),
	company: one(companies, {
		fields: [jobOffers.companyId],
		references: [companies.id],
	}),
}));

export type JobOffer = typeof jobOffers.$inferSelect;
