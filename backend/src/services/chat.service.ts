import { and, desc, eq, lt, or } from 'drizzle-orm';
import { db } from '../db/index';
import * as userService from '../services/user.service';
import { CreateMessageSchema } from '../validators/chat';
import { chats } from '../db/schema/chat';
import { chatUsers } from '../db/schema/chatUser';
import { messages } from '../db/schema/message';

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
		.returning({
			id: messages.id,
			content: messages.content,
			createdAt: messages.createdAt,
		});

	const { password, githubId, email, id, ...user } =
		(await userService.findUserById(userId))!;

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
			user: {
				columns: {
					password: false,
					id: false,
					githubId: false,
					email: false,
				},
			},
		},
		columns: {
			chatId: false,
			userId: false,
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
