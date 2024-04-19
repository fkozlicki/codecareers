import { Request, Response } from 'express';
import * as companyService from '../services/company.service';
import * as jobOfferService from '../services/jobOffer.service';
import * as recruitmentService from '../services/recruitment.service';
import {
	CreateCompanySchema,
	CreateJobOfferSchema,
	DeleteCompanySchema,
	GetCompanyJobOffersSchema,
	GetCompanyRecruitmentsSchema,
	GetCompanySchema,
	UpdateCompanySchema,
} from '../validators/companies';

export const getCompany = async (
	req: Request<GetCompanySchema['params']>,
	res: Response
) => {
	const { id } = req.params;

	try {
		const result = await companyService.findCompanyById(id);

		if (!result) {
			return res
				.status(404)
				.json({ message: `Company with id ${id} not found` });
		}

		const { ownerId, ...company } = result;

		if (ownerId !== res.locals.user.id) {
			return res
				.status(403)
				.json({ message: "You don't have permission to access this data" });
		}

		res.status(200).json({ company });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

export const getCompanies = async (req: Request, res: Response) => {
	try {
		const result = await companyService.findCompaniesByUserId(
			res.locals.user.id
		);

		res.status(200).json({ companies: result });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

export const createCompany = async (
	req: Request<{}, {}, CreateCompanySchema['body']> & {
		files: CreateCompanySchema['files'];
	},
	res: Response
) => {
	try {
		const newCompany = await companyService.createCompany(
			res.locals.user.id,
			req.body,
			req.files
		);

		res.status(201).json({ company: newCompany });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

export const updateCompany = async (
	req: Request<
		UpdateCompanySchema['params'],
		{},
		UpdateCompanySchema['body']
	> & {
		files: UpdateCompanySchema['files'];
	},
	res: Response
) => {
	const { id } = req.params;

	try {
		const company = await companyService.findCompanyById(id);

		if (!company) {
			return res
				.status(404)
				.json({ message: `Company with id ${id} not found` });
		}

		if (company.ownerId !== res.locals.user.id) {
			return res
				.status(403)
				.json({ message: "You don't have permission to access this data" });
		}

		const updatedCompany = await companyService.updateCompany(
			id,
			req.body,
			req.files
		);

		const { ownerId, ...rest } = updatedCompany;

		res.status(200).json({ company: rest });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

export const deleteCompany = async (
	req: Request<DeleteCompanySchema['params']>,
	res: Response
) => {
	const { id } = req.params;

	try {
		const company = await companyService.findCompanyById(id);

		if (!company) {
			return res
				.status(404)
				.json({ message: `Company with id ${id} not found` });
		}

		if (company.ownerId !== res.locals.user.id) {
			return res
				.status(403)
				.json({ message: "You don't have permission to access this data" });
		}

		const deletedCompany = await companyService.deleteCompanyById(id);

		res.status(200).json({ company: deletedCompany });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

export const createJobOffer = async (
	req: Request<
		CreateJobOfferSchema['params'],
		{},
		CreateJobOfferSchema['body']
	>,
	res: Response
) => {
	const { id } = req.params;

	const { technologies, skills, ...rest } = req.body;

	try {
		const newJobOffer = await jobOfferService.createJobOffer(id, rest);

		await jobOfferService.createJobOfferTechnologies(
			newJobOffer.id,
			technologies
		);
		await jobOfferService.createJobOfferSkills(newJobOffer.id, skills);

		res.status(201).json({ jobOffer: newJobOffer });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

export const getCompanyJobOffers = async (
	req: Request<
		GetCompanyJobOffersSchema['params'],
		{},
		{},
		GetCompanyJobOffersSchema['query']
	>,
	res: Response
) => {
	const { id } = req.params;
	const { sort } = req.query;

	try {
		const result = await jobOfferService.getJobOffersByCompanyId(id, sort);

		res.status(200).json({ jobOffers: result });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

export const getCompanyRecruitments = async (
	req: Request<GetCompanyRecruitmentsSchema['params']>,
	res: Response
) => {
	const { id } = req.params;

	try {
		const result = await recruitmentService.getRecruitmentsByCompanyId(id);

		res.status(200).json({ recruitments: result });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};
