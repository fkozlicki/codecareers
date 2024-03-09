import { Router } from 'express';
import {
	createCompany,
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

export const companiesRouter = Router();

companiesRouter
	.route('/')
	.get(getCompanies)
	.post(requireSession, createCompany);

companiesRouter
	.route('/:id')
	.get(getCompany)
	.put(requireSession, updateCompany)
	.delete(requireSession, deleteCompany);

companiesRouter
	.route('/:id/job-offers')
	.get(requireSession, getJobOffers)
	.post(requireSession, validate(jobOfferSchema), createJobOffer);
