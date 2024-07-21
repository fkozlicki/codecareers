import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { chats } from './chat';
import { users } from './user';

export const chatUsers = pgTable(
	'chat_user',
	{
		chatId: uuid('chat_id')
			.notNull()
			.references(() => chats.id),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id),
	},
	(t) => ({ pk: primaryKey({ columns: [t.chatId, t.userId] }) })
);

export const chatUsersRelations = relations(chatUsers, ({ one }) => ({
	chat: one(chats, {
		fields: [chatUsers.chatId],
		references: [chats.id],
	}),
	user: one(users, {
		fields: [chatUsers.userId],
		references: [users.id],
	}),
}));
