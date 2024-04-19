import { Router } from 'express';
import {
	getRecruitment,
	getRecruitments,
} from '../controllers/recruitment.controller';
import { requireSession } from '../middleware/session';
import { validate } from '../middleware/validate';
import { getRecruitmentSchema } from '../validators/recruitment';

export const recruitmentsRouter = Router();

recruitmentsRouter.route('/').get(requireSession, getRecruitments);
recruitmentsRouter
	.route('/:id')
	.get(requireSession, validate(getRecruitmentSchema), getRecruitment);
