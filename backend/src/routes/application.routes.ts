import { Router } from 'express';
import {
	acceptApplication,
	getApplications,
	rejectApplication,
} from '../controllers/application.controller.js';
import { requireSession } from '../middleware/session.js';
import { validate } from '../middleware/validate.js';
import { getApplicationsSchema } from '../validators/applications.js';

export const applicationsRouter = Router();

applicationsRouter
	.route('/')
	.get(requireSession, validate(getApplicationsSchema), getApplications);
applicationsRouter.route('/:id/accept').post(requireSession, acceptApplication);
applicationsRouter.route('/:id/reject').post(requireSession, rejectApplication);
