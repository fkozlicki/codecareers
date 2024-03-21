import { Router } from 'express';
import { requireSession } from '../middleware/session';
import {
	getApplications,
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
