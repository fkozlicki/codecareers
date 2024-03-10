import { Router } from 'express';
import {
	createApplication,
	getJobOffer,
	getJobOffers,
} from '../controllers/jobOffersController';

export const jobOffersRouter = Router();

jobOffersRouter.route('/').get(getJobOffers);
jobOffersRouter.route('/:id').get(getJobOffer);
jobOffersRouter.route('/:id/applications').post(createApplication);
