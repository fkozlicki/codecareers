import { Router } from 'express';
import { requireSession } from '../middleware/session';
import {
	getApplications,
	updateApplication,
} from '../controllers/applicationsController';

export const applicationsRouter = Router();

applicationsRouter.route('/').get(requireSession, getApplications);
applicationsRouter.route('/:id').put(requireSession, updateApplication);
