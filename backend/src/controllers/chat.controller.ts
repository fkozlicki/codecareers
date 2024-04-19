import { Request, Response } from 'express';
import { io } from '..';
import * as chatService from '../services/chat.service';
import { GetMessagesSchema } from '../validators/chat';

export const getMessages = async (
	req: Request<GetMessagesSchema['params'], {}, {}, GetMessagesSchema['query']>,
	res: Response
) => {
	const { id } = req.params;
	const { cursor, pageSize } = req.query;

	try {
		const {
			messages,
			cursor: nextCursor,
			hasNextPage,
		} = await chatService.findMessagesByChatId(id, cursor, pageSize);

		res.status(200).json({ messages, cursor: nextCursor, hasNextPage });
	} catch (error) {
		res.status(500).json({ messages: 'Server error' });
	}
};

export const createMessage = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const newMessage = await chatService.createMessage(
			id,
			res.locals.user.id,
			req.body
		);

		io.to(`chat-${id}`).emit('message', newMessage);

		res.status(201).json({ message: newMessage });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};
