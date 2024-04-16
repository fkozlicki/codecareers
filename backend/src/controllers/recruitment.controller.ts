import { and, count, desc, eq, gt } from 'drizzle-orm';
import { Request, Response } from 'express';
import { db } from '../db';
import { chats, messages, recruitments } from '../db/schema';

export const getRecruitment = async (req: Request, res: Response) => {
	const { id } = req.params;

	const recruitment = await db.query.recruitments.findFirst({
		where: eq(recruitments.id, id),
		with: {
			application: {
				with: {
					user: true,
					jobOffer: true,
				},
			},
		},
	});

	if (!recruitment) {
		return res.status(404).json({ message: 'Not found' });
	}

	res.status(200).json({ recruitment });
};

export const getMessages = async (req: Request, res: Response) => {
	const { id } = req.params;
	const pageSize = req.query.pageSize ? +req.query.pageSize : 10;
	const cursor = req.query.cursor as string | undefined;

	const chat = await db.query.chats.findFirst({
		where: eq(chats.recruitmentId, id),
	});

	if (!chat) {
		return res.status(404).json({ message: 'Not found' });
	}

	const result = await db.query.messages.findMany({
		where: and(
			eq(messages.chatId, chat.id),
			cursor ? gt(messages.id, cursor) : undefined
		),
		limit: pageSize,
		orderBy: desc(messages.createdAt),
		with: {
			user: true,
		},
	});

	let hasNextPage = false;
	const nextCursor = result.at(-1)?.id;

	if (nextCursor) {
		const [result] = await db
			.select({ count: count() })
			.from(messages)
			.where(gt(messages.id, nextCursor))
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

	const chat = await db.query.chats.findFirst({
		where: eq(chats.recruitmentId, id),
	});

	if (!chat) {
		return res.status(404).json({ message: 'Not found' });
	}

	const [newMessage] = await db
		.insert(messages)
		.values({
			chatId: chat.id,
			userId: res.locals.user.id,
			content,
		})
		.returning();

	res.status(201).json({ message: newMessage });
};
