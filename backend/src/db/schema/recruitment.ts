import { relations } from 'drizzle-orm';
import { boolean, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { applications } from './application';
import { chats } from './chat';

export const recruitments = pgTable('recruitment', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
	applicationId: uuid('application_id').notNull(),
	chatId: uuid('chat_id').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	open: boolean('open').notNull().default(true),
});

export const recruitmentsRelations = relations(recruitments, ({ one }) => ({
	application: one(applications, {
		fields: [recruitments.applicationId],
		references: [applications.id],
	}),
	chat: one(chats, {
		fields: [recruitments.chatId],
		references: [chats.id],
	}),
}));
