import { Router } from 'express';
import {
	createCompany,
	createCompanySchema,
	createJobOffer,
	deleteCompany,
	getCompanies,
	getCompany,
	getJobOffers,
	jobOfferSchema,
	updateCompany,
} from '../controllers/companiesController';
import { requireSession } from '../middleware/session';
import { validate } from '../middleware/validate';
import { upload } from '../lib/multer';

export const companiesRouter = Router();

companiesRouter
	.route('/')
	.get(getCompanies)
	.post(
		requireSession,
		upload.fields([
			{ name: 'avatar', maxCount: 1 },
			{ name: 'banner', maxCount: 1 },
		]),
		validate(createCompanySchema),
		createCompany
	);

companiesRouter
	.route('/:id')
	.get(getCompany)
	.put(requireSession, updateCompany)
	.delete(requireSession, deleteCompany);

companiesRouter
	.route('/:id/job-offers')
	.get(requireSession, getJobOffers)
	.post(requireSession, validate(jobOfferSchema), createJobOffer);
