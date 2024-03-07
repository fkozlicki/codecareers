import { Router } from 'express';
import {
	createCompany,
	deleteCompany,
	getCompanies,
	getCompany,
	updateCompany,
} from '../controllers/companiesController';
import { requireSession } from '../middleware/session';

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
