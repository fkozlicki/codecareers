import { Router } from 'express';
import {
	acceptApplication,
	getApplications,
	rejectApplication,
} from '../controllers/application.controller';
import { requireSession } from '../middleware/session';
import { validate } from '../middleware/validate';
import { getApplicationsSchema } from '../validators/applications';

export const applicationsRouter = Router();

applicationsRouter
	.route('/')
	.get(requireSession, validate(getApplicationsSchema), getApplications);
applicationsRouter.route('/:id/accept').post(requireSession, acceptApplication);
applicationsRouter.route('/:id/reject').post(requireSession, rejectApplication);
