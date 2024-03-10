import { Router } from 'express';
import { requireSession } from '../middleware/session';
import { getApplications } from '../controllers/applicationsController';

export const applicationsRouter = Router();

applicationsRouter.route('/').get(requireSession, getApplications);
