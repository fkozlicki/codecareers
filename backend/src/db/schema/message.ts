import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { chats } from './chat';
import { users } from './user';

export const messages = pgTable('message', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
	content: text('content'),
	chatId: uuid('chat_id').notNull(),
	userId: uuid('user_id').notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
});

export const messagesRelations = relations(messages, ({ one }) => ({
	chat: one(chats, {
		fields: [messages.chatId],
		references: [chats.id],
	}),
	user: one(users, {
		fields: [messages.userId],
		references: [users.id],
	}),
}));
