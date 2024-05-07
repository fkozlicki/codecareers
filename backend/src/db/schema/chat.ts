import { relations } from 'drizzle-orm';
import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { chatUsers } from './chatUser.js';
import { messages } from './message.js';

export const chats = pgTable('chat', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
});

export const chatsRelations = relations(chats, ({ many, one }) => ({
	chatUsers: many(chatUsers),
	messages: many(messages),
}));
