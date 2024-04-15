import { Router } from 'express';
import { requireSession } from '../middleware/session';
import {
	acceptApplication,
	getApplications,
	rejectApplication,
	updateApplication,
} from '../controllers/application.controller';
import { validate } from '../middleware/validate';
import {
	getApplicationsSchema,
	updateApplicationSchema,
} from '../validators/applications';

export const applicationsRouter = Router();

applicationsRouter
	.route('/')
	.get(requireSession, validate(getApplicationsSchema), getApplications);
applicationsRouter
	.route('/:id')
	.put(requireSession, validate(updateApplicationSchema), updateApplication);
applicationsRouter.route('/:id/accept').post(requireSession, acceptApplication);
applicationsRouter.route('/:id/reject').post(requireSession, rejectApplication);
