import { Router } from 'express';
import { requireSession } from '../middleware/session.js';
import { createMessage, getMessages } from '../controllers/chat.controller.js';
import { validate } from '../middleware/validate.js';
import { createMessageSchema, getMessagesSchema } from '../validators/chat.js';

export const chatsRouter = Router();

chatsRouter
	.route('/:id/messages')
	.get(requireSession, validate(getMessagesSchema), getMessages)
	.post(requireSession, validate(createMessageSchema), createMessage);
