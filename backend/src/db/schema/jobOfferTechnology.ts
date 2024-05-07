import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { jobOffers } from './jobOffer.js';
import { technologies } from './technology.js';

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

export const jobOfferTechnologiesRelations = relations(
	jobOfferTechnologies,
	({ one }) => ({
		jobOffer: one(jobOffers, {
			fields: [jobOfferTechnologies.jobOfferId],
			references: [jobOffers.id],
		}),
		technology: one(technologies, {
			fields: [jobOfferTechnologies.technologyId],
			references: [technologies.id],
		}),
	})
);
