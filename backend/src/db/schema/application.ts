import { relations } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { jobOffers } from './jobOffer';
import { users } from './user';

export const applications = pgTable('application', {
	id: uuid('id').primaryKey().defaultRandom(),
	createdAt: timestamp('created_at', {
		withTimezone: true,
		mode: 'date',
	})
		.notNull()
		.defaultNow(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id),
	jobOfferId: uuid('job_offer_id')
		.notNull()
		.references(() => jobOffers.id),
	cv: text('cv'),
	introduction: text('introduction'),
	accepted: boolean('accepted'),
});

export type Application = typeof applications.$inferSelect;

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
