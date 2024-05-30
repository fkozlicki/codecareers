import { Router } from 'express';
import {
	createApplication,
	deleteJobOffer,
	getApplications,
	getJobOffer,
	getJobOffers,
	updateJobOffer,
} from '../controllers/jobOffer.controller';
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
	.put(validate(updateJobOfferSchema), updateJobOffer)
	.delete(deleteJobOffer);
jobOffersRouter
	.route('/:id/applications')
	.post(
		upload.single('cv'),
		validate(createApplicationSchema),
		createApplication
	)
	.get(validate(getJobOfferApplications), getApplications);
