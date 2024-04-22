import { and, desc, eq, lt, or } from 'drizzle-orm';
import { db } from '../db/index.js';
import { chatUsers, chats, messages } from '../db/schema.js';
import * as userService from '../services/user.service.js';
import { CreateMessageSchema } from '../validators/chat.js';

export const createChat = async (userId: string, ownerId: string) => {
	const [newChat] = await db.insert(chats).values({}).returning();

	await db.insert(chatUsers).values({ chatId: newChat.id, userId });

	if (ownerId !== userId) {
		await db.insert(chatUsers).values({
			chatId: newChat.id,
			userId: ownerId,
		});
	}

	return newChat;
};

export const createMessage = async (
	chatId: string,
	userId: string,
	body: CreateMessageSchema['body']
) => {
	const [newMessage] = await db
		.insert(messages)
		.values({
			chatId,
			userId,
			...body,
		})
		.returning();

	const { password, ...user } = (await userService.findUserById(userId))!;

	return { ...newMessage, user };
};

export const findMessagesByChatId = async (
	chatId: string,
	cursor?: string,
	pageSize?: string
) => {
	let cursorMessage;

	if (cursor) {
		cursorMessage = await db.query.messages.findFirst({
			where: eq(messages.id, cursor),
		});
	}

	const result = await db.query.messages.findMany({
		where: and(
			eq(messages.chatId, chatId),
			cursorMessage
				? or(
						lt(messages.createdAt, cursorMessage.createdAt),
						and(
							eq(messages.createdAt, cursorMessage.createdAt),
							lt(messages.id, cursorMessage.id)
						)
				  )
				: undefined
		),
		limit: pageSize ? +pageSize : 10,
		orderBy: desc(messages.createdAt),
		with: {
			user: true,
		},
	});

	let hasNextPage = false;
	const lastItem = result.at(-1);
	const nextCursor = lastItem?.id;

	if (lastItem) {
		const result = await db.query.messages.findFirst({
			where: and(
				eq(messages.chatId, chatId),
				lt(messages.createdAt, lastItem.createdAt)
			),
		});
		if (result) {
			hasNextPage = true;
		}
	}

	return { cursor: nextCursor, hasNextPage, messages: result };
};
