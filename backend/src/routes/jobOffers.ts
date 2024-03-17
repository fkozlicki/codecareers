import { Router } from 'express';
import {
	createApplication,
	getApplications,
	getJobOffer,
	getJobOffers,
	updateJobOffer,
} from '../controllers/jobOffersController';
import { upload } from '../lib/multer';
import { validate } from '../middleware/validate';
import {
	createApplicationSchema,
	getJobOfferApplications,
	getJobOfferSchema,
	updateJobOfferSchema,
} from '../validators/jobOffers';

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
