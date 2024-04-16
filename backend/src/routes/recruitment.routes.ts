import { Router } from 'express';
import { requireSession } from '../middleware/session';
import {
	createMessage,
	getMessages,
	getRecruitment,
} from '../controllers/recruitment.controller';

export const recruitmentsRouter = Router();

recruitmentsRouter.route('/:id').get(requireSession, getRecruitment);
recruitmentsRouter
	.route('/:id/chat/messages')
	.get(requireSession, getMessages)
	.post(requireSession, createMessage);
