import { Router } from 'express';
import {
	getRecruitment,
	getRecruitments,
} from '../controllers/recruitment.controller.js';
import { requireSession } from '../middleware/session.js';
import { validate } from '../middleware/validate.js';
import { getRecruitmentSchema } from '../validators/recruitment.js';

export const recruitmentsRouter = Router();

recruitmentsRouter.route('/').get(requireSession, getRecruitments);
recruitmentsRouter
	.route('/:id')
	.get(requireSession, validate(getRecruitmentSchema), getRecruitment);
