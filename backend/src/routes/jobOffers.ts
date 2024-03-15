import { Router } from 'express';
import {
	createApplication,
	getApplications,
	getJobOffer,
	getJobOffers,
	updateJobOffer,
} from '../controllers/jobOffersController';
import { upload } from '../lib/multer';

export const jobOffersRouter = Router();

jobOffersRouter.route('/').get(getJobOffers);
jobOffersRouter.route('/:id').get(getJobOffer).put(updateJobOffer);
jobOffersRouter
	.route('/:id/applications')
	.post(upload.single('cv'), createApplication)
	.get(getApplications);
