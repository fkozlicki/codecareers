import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { jobOffers } from './jobOffer';
import { skills } from './skill';

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

export const jobOfferSkillsRelations = relations(jobOfferSkills, ({ one }) => ({
	jobOffer: one(jobOffers, {
		fields: [jobOfferSkills.jobOfferId],
		references: [jobOffers.id],
	}),
	skill: one(skills, {
		fields: [jobOfferSkills.skillId],
		references: [skills.id],
	}),
}));
