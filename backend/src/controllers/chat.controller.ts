import { and, count, desc, eq, lt, or } from 'drizzle-orm';
import { Request, Response } from 'express';
import { io } from '..';
import { db } from '../db';
import { messages } from '../db/schema';

export const getMessages = async (req: Request, res: Response) => {
	const { id } = req.params;
	const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
	const messageId = req.query.cursor as string | undefined;

	const cursor = messageId
		? await db.query.messages.findFirst({
				where: eq(messages.id, messageId),
		  })
		: undefined;

	const result = await db.query.messages.findMany({
		where: and(
			eq(messages.chatId, id),
			cursor
				? or(
						lt(messages.createdAt, cursor.createdAt),
						and(
							eq(messages.createdAt, cursor.createdAt),
							lt(messages.id, cursor.id)
						)
				  )
				: undefined
		),
		limit: pageSize,
		orderBy: [desc(messages.createdAt)],
		with: {
			user: true,
		},
	});

	let hasNextPage = false;
	const lastItem = result.at(-1);
	const nextCursor = lastItem?.id;

	if (lastItem) {
		const [result] = await db
			.select({ count: count() })
			.from(messages)
			.where(
				and(
					eq(messages.chatId, id),
					or(
						lt(messages.createdAt, lastItem.createdAt),
						and(
							eq(messages.createdAt, lastItem.createdAt),
							lt(messages.id, lastItem.id)
						)
					)
				)
			)
			.limit(1);
		if (result.count > 0) {
			hasNextPage = true;
		}
	}

	res.status(200).json({ messages: result, cursor: nextCursor, hasNextPage });
};

export const createMessage = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { content } = req.body;

	const [newMessage] = await db
		.insert(messages)
		.values({
			chatId: id,
			userId: res.locals.user.id,
			content,
		})
		.returning();

	const result = await db.query.messages.findFirst({
		where: eq(messages.id, newMessage.id),
		with: {
			user: true,
		},
	});

	io.to(`chat-${id}`).emit('message', result);

	res.status(201).json({ message: result });
};
