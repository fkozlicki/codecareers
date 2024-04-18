import { and, count, desc, eq, lt, or } from 'drizzle-orm';
import { Request, Response } from 'express';
import { io } from '..';
import { db } from '../db';
import { messages } from '../db/schema';

export const getMessages = async (req: Request, res: Response) => {
	const { id } = req.params;
	const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
	const cursor = req.query.cursor as string | undefined;

	const cursorMessage = cursor
		? await db.query.messages.findFirst({
				where: eq(messages.id, cursor),
		  })
		: undefined;

	const result = await db.query.messages.findMany({
		where: and(
			eq(messages.chatId, id),
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
		const result = await db.query.messages.findFirst({
			where: and(
				eq(messages.chatId, id),
				lt(messages.createdAt, lastItem.createdAt)
			),
		});
		if (result) {
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
