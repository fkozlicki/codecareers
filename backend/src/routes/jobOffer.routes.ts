import { Router } from 'express';
import {
	createApplication,
	getApplications,
	getJobOffer,
	getJobOffers,
	updateJobOffer,
} from '../controllers/jobOffer.controller.js';
import { upload } from '../lib/multer.js';
import { validate } from '../middleware/validate.js';
import {
	createApplicationSchema,
	getJobOfferApplications,
	getJobOfferSchema,
	updateJobOfferSchema,
} from '../validators/jobOffers.js';

export const jobOffersRouter = Router();

jobOffersRouter.route('/').get(getJobOffers);
jobOffersRouter
	.route('/:id')
	.get(validate(getJobOfferSchema), getJobOffer)
	.put(validate(updateJobOfferSchema), updateJobOffer);
jobOffersRouter
	.route('/:id/applications')
	.post(
		upload.single('cv'),
		validate(createApplicationSchema),
		createApplication
	)
	.get(validate(getJobOfferApplications), getApplications);
