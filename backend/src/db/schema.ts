import { relations, sql } from 'drizzle-orm';
import {
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core';

export const users = pgTable('user', {
	id: uuid('id').primaryKey().defaultRandom(),
	firstName: text('first_name'),
	lastName: text('last_name'),
	githubId: integer('github_id'),
	username: text('username'),
	email: text('email').unique(),
	password: text('password'),
});

export const usersRelations = relations(users, ({ many }) => ({
	companies: many(companies),
	applications: many(applications),
}));

export type User = typeof users.$inferSelect;

export const sessions = pgTable('session', {
	id: text('id').primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date',
	}).notNull(),
});

export const companies = pgTable('company', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	phoneNumber: text('phone_number').notNull(),
	ownerId: uuid('owner_id').notNull(),
	description: text('description'),
	avatarUrl: text('avatar_url'),
	backgroundUrl: text('background_url'),
});

export const companiesRelations = relations(companies, ({ one, many }) => ({
	owner: one(users, {
		fields: [companies.ownerId],
		references: [users.id],
	}),
	jobOffers: many(jobOffers),
}));

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
export const currency = pgEnum('currency', ['pln', 'gbp', 'eur', 'usd']);

export const technologies = pgTable('technology', {
	id: uuid('id').primaryKey(),
	name: text('name').notNull(),
});

export const technologiesRelations = relations(technologies, ({ many }) => ({
	jobOfferTechnologies: many(jobOfferTechnologies),
}));

export const skills = pgTable('skill', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
});

export const skillsRelations = relations(skills, ({ many }) => ({
	jobOfferSkills: many(jobOfferSkills),
}));

export const jobOffers = pgTable('job_offer', {
	id: uuid('id').primaryKey().defaultRandom(),
	position: text('position').notNull(),
	description: text('description').notNull(),
	level: levelEnum('level').notNull(),
	employmentType: employmentTypeEnum('employment_type').notNull(),
	workType: workTypeEnum('work_type').notNull(),
	salaryFrom: integer('salary_from').notNull(),
	salaryTo: integer('salary_to').notNull(),
	salaryCurrency: currency('currency').notNull(),
	companyId: uuid('company_id').notNull(),
	createdAt: timestamp('created_at', {
		withTimezone: true,
		mode: 'date',
	})
		.notNull()
		.defaultNow(),
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

export const jobOfferTechnologies = pgTable(
	'job_offer_technology',
	{
		jobOfferId: uuid('job_offer_id')
			.notNull()
			.references(() => jobOffers.id),
		technologyId: uuid('technology_id')
			.notNull()
			.references(() => technologies.id),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.jobOfferId, t.technologyId] }),
	})
);

export const jobOfferSkills = pgTable(
	'job_offer_skill',
	{
		jobOfferId: uuid('job_offer_id')
			.notNull()
			.references(() => jobOffers.id),
		skillId: uuid('skill_id')
			.notNull()
			.references(() => skills.id),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.jobOfferId, t.skillId] }),
	})
);

export const applications = pgTable('application', {
	id: uuid('id').primaryKey().defaultRandom(),
	createdAt: timestamp('created_at', {
		withTimezone: true,
		mode: 'date',
	})
		.notNull()
		.defaultNow(),
	userId: uuid('user_id').notNull(),
	jobOfferId: uuid('job_offer_id').notNull(),
	cv: text('cv'),
	introduction: text('introduction'),
});

export const applicationsRelations = relations(applications, ({ one }) => ({
	jobOffer: one(jobOffers, {
		fields: [applications.jobOfferId],
		references: [jobOffers.id],
	}),
	user: one(users, {
		fields: [applications.userId],
		references: [users.id],
	}),
}));
