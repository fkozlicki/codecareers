import { Router } from 'express';
import {
	createCompany,
	createJobOffer,
	deleteCompany,
	getCompanies,
	getCompany,
	getCompanyJobOffers,
	getCompanyRecruitments,
	updateCompany,
} from '../controllers/company.controller.js';
import { upload } from '../lib/multer.js';
import { requireSession } from '../middleware/session.js';
import { validate } from '../middleware/validate.js';
import {
	createCompanySchema,
	createJobOfferSchema,
	deleteCompanySchema,
	getCompanyJobOffersSchema,
	getCompanyRecruitmentsSchema,
	getCompanySchema,
	updateCompanySchema,
} from '../validators/companies.js';

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
	.get(requireSession, validate(getCompanySchema), getCompany)
	.put(
		requireSession,
		upload.fields([
			{ name: 'avatar', maxCount: 1 },
			{ name: 'banner', maxCount: 1 },
		]),
		validate(updateCompanySchema),
		updateCompany
	)
	.delete(requireSession, validate(deleteCompanySchema), deleteCompany);

companiesRouter
	.route('/:id/job-offers')
	.get(requireSession, validate(getCompanyJobOffersSchema), getCompanyJobOffers)
	.post(requireSession, validate(createJobOfferSchema), createJobOffer);

companiesRouter
	.route('/:id/recruitments')
	.get(
		requireSession,
		validate(getCompanyRecruitmentsSchema),
		getCompanyRecruitments
	);
