import { and, eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import { db } from '../db';
import {
	applications,
	companies,
	jobOfferSkills,
	jobOfferTechnologies,
	jobOffers,
	recruitments,
	skills,
	technologies,
	users,
} from '../db/schema';
import * as companyService from '../services/company.service';
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

	const { technologies: _technologies, skills: _skills, ...rest } = req.body;

	const [result] = await db
		.insert(jobOffers)
		.values({ companyId: id, ...rest })
		.returning();

	const newTechnologies = _technologies.filter(
		(technology) => technology.__isNew__
	);
	const existingTechnologies = _technologies.filter(
		(technology) => !technology.__isNew__
	);

	const createdTechnologies =
		newTechnologies.length > 0
			? await db
					.insert(technologies)
					.values(newTechnologies.map((tech) => ({ name: tech.value })))
					.returning()
			: [];

	await db.insert(jobOfferTechnologies).values(
		existingTechnologies
			.map((tech) => ({
				jobOfferId: result.id,
				technologyId: tech.value,
			}))
			.concat(
				createdTechnologies.map((tech) => ({
					jobOfferId: result.id,
					technologyId: tech.id,
				}))
			)
	);

	const newSkills = _skills.filter((skill) => skill.__isNew__);
	const existingSkills = _skills.filter((skill) => !skill.__isNew__);

	const createdSkills =
		newSkills.length > 0
			? await db
					.insert(skills)
					.values(newSkills.map((skill) => ({ name: skill.value })))
					.returning()
			: [];

	await db.insert(jobOfferSkills).values(
		existingSkills
			.map((skill) => ({
				jobOfferId: result.id,
				skillId: skill.value,
			}))
			.concat(
				createdSkills.map((skill) => ({
					jobOfferId: result.id,
					skillId: skill.id,
				}))
			)
	);

	const createdJobOffer = await db.query.jobOffers.findFirst({
		where: eq(jobOffers.id, result.id),
		columns: {
			companyId: false,
		},
		with: {
			jobOfferSkills: {
				with: {
					skill: true,
				},
				columns: {
					jobOfferId: false,
					skillId: false,
				},
			},
			jobOfferTechnologies: {
				with: {
					technology: true,
				},
				columns: {
					jobOfferId: false,
					technologyId: false,
				},
			},
		},
	});

	res.status(201).json({ jobOffer: createdJobOffer });
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
	const sort = req.query.sort;

	const result = await db.query.jobOffers.findMany({
		where: and(
			eq(jobOffers.companyId, id),
			sort ? eq(jobOffers.published, sort === 'public') : undefined
		),
		with: {
			company: true,
		},
	});

	res.status(200).json({ jobOffers: result });
};

export const getCompanyRecruitments = async (
	req: Request<GetCompanyRecruitmentsSchema['params']>,
	res: Response
) => {
	const { id } = req.params;

	const result = await db
		.select({
			id: recruitments.id,
			jobOffer: {
				position: jobOffers.position,
			},
			user: {
				id: users.id,
				firstName: users.firstName,
				lastName: users.lastName,
				username: users.username,
				avatar: users.avatar,
			},
		})
		.from(recruitments)
		.leftJoin(applications, eq(recruitments.applicationId, applications.id))
		.leftJoin(jobOffers, eq(applications.jobOfferId, jobOffers.id))
		.leftJoin(companies, eq(jobOffers.companyId, companies.id))
		.leftJoin(users, eq(applications.userId, users.id))
		.where(eq(companies.id, id));

	res.status(200).json({ recruitments: result });
};
