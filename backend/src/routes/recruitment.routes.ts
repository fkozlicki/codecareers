import { Router } from 'express';
import {
	getRecruitment,
	getRecruitments,
} from '../controllers/recruitment.controller';
import { requireSession } from '../middleware/session';

export const recruitmentsRouter = Router();

recruitmentsRouter.route('/').get(requireSession, getRecruitments);
recruitmentsRouter.route('/:id').get(requireSession, getRecruitment);
