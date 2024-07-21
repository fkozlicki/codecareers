import { relations } from 'drizzle-orm';
import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { chatUsers } from './chatUser';
import { messages } from './message';

export const chats = pgTable('chat', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
});

export const chatsRelations = relations(chats, ({ many }) => ({
	chatUsers: many(chatUsers),
	messages: many(messages),
}));
