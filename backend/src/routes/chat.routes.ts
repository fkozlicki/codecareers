import { Router } from 'express';
import { requireSession } from '../middleware/session';
import { createMessage, getMessages } from '../controllers/chat.controller';
import { validate } from '../middleware/validate';
import { createMessageSchema, getMessagesSchema } from '../validators/chat';

export const chatsRouter = Router();

chatsRouter
	.route('/:id/messages')
	.get(requireSession, validate(getMessagesSchema), getMessages)
	.post(requireSession, validate(createMessageSchema), createMessage);
