import { Router } from 'express';
import { requireSession } from '../middleware/session';
import { createMessage, getMessages } from '../controllers/chat.controller';

export const chatsRouter = Router();

chatsRouter
	.route('/:id/messages')
	.get(requireSession, getMessages)
	.post(requireSession, createMessage);
