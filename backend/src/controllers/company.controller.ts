import { and, eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import { generateId } from 'lucia';
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
import { uploadFileToS3 } from '../lib/s3';
import { CompanyFiles, CreateJobOfferSchema } from '../validators/companies';

export const getCompany = async (req: Request, res: Response) => {
	const id = req.params.id;

	const result = await db.query.companies.findFirst({
		where: eq(companies.id, id),
	});

	if (!result) {
		return res.status(404).json({ message: `Company with id ${id} not found` });
	}

	const { ownerId, ...company } = result;

	if (ownerId !== res.locals.user.id) {
		return res
			.status(403)
			.json({ message: "You don't have permission to access this data" });
	}

	res.status(200).json({ company });
};

export const getCompanies = async (req: Request, res: Response) => {
	const userId = req.params.userId;

	if (userId && userId !== res.locals.user.id) {
		return res
			.status(403)
			.json({ message: "You don't have permission to access this data" });
	}

	const result = await db.query.companies.findMany({
		where: eq(companies.ownerId, userId ?? res.locals.user.id),
		columns: {
			ownerId: false,
		},
	});

	res.status(200).json({ companies: result });
};

export const createCompany = async (req: Request, res: Response) => {
	const files = req.files as CompanyFiles | undefined;
	const avatarFilename = generateId(15);
	const bannerFilename = generateId(15);

	if (files) {
		try {
			if (files.avatar) {
				await uploadFileToS3(
					`avatars/${avatarFilename}`,
					files.avatar[0].buffer
				);
			}
			if (files.banner) {
				await uploadFileToS3(
					`avatars/${bannerFilename}`,
					files.banner[0].buffer
				);
			}
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Server error' });
		}
	}

	const [newCompany] = await db
		.insert(companies)
		.values({
			ownerId: res.locals.user.id,
			...req.body,
			...(files?.avatar
				? { avatarUrl: `http://localhost:3000/avatars/${avatarFilename}` }
				: {}),
			...(files?.banner
				? { backgroundUrl: `http://localhost:3000/avatars/${bannerFilename}` }
				: {}),
		})
		.returning({
			id: companies.id,
			name: companies.name,
			description: companies.description,
			phoneNumber: companies.phoneNumber,
			avatarUrl: companies.avatarUrl,
			backgroundUrl: companies.backgroundUrl,
		});

	res.status(201).json({ company: newCompany });
};

export const updateCompany = async (req: Request, res: Response) => {
	const id = req.params.id;

	const company = await db.query.companies.findFirst({
		where: eq(companies.id, req.params.id),
	});

	if (!company) {
		return res.status(404).json({ message: `Company with id ${id} not found` });
	}

	if (company.ownerId !== res.locals.user.id) {
		return res
			.status(403)
			.json({ message: "You don't have permission to access this data" });
	}

	const files = req.files as CompanyFiles | undefined;
	const avatarFilename = generateId(15);
	const bannerFilename = generateId(15);

	if (files) {
		try {
			if (files.avatar) {
				await uploadFileToS3(
					`avatars/${avatarFilename}`,
					files.avatar[0].buffer
				);
			}
			if (files.banner) {
				await uploadFileToS3(
					`avatars/${bannerFilename}`,
					files.banner[0].buffer
				);
			}
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Server error' });
		}
	}

	const [result] = await db
		.update(companies)
		.set({
			...req.body,
			...(files?.avatar
				? { avatarUrl: `http://localhost:3000/avatars/${avatarFilename}` }
				: {}),
			...(files?.banner
				? { backgroundUrl: `http://localhost:3000/avatars/${bannerFilename}` }
				: {}),
		})
		.where(eq(companies.id, id))
		.returning();

	const { ownerId, ...updatedCompany } = result;

	res.status(200).json({ company: updatedCompany });
};

export const deleteCompany = async (req: Request, res: Response) => {
	const id = req.params.id;

	const company = await db.query.companies.findFirst({
		where: eq(companies.id, req.params.id),
	});

	if (!company) {
		return res.status(404).json({ message: `Company with id ${id} not found` });
	}

	if (company.ownerId !== res.locals.user.id) {
		return res
			.status(403)
			.json({ message: "You don't have permission to access this data" });
	}

	await db.delete(companies).where(eq(companies.id, id)).returning();

	res.status(204).json({ message: 'Company deleted successfully' });
};

export const createJobOffer = async (
	req: Request<
		CreateJobOfferSchema['params'],
		{},
		CreateJobOfferSchema['body']
	>,
	res: Response
) => {
	const companyId = req.params.id;

	const { technologies: _technologies, skills: _skills, ...rest } = req.body;

	const [result] = await db
		.insert(jobOffers)
		.values({ companyId, ...rest })
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

export const getCompanyJobOffers = async (req: Request, res: Response) => {
	const companyId = req.params.id;
	const sort = req.query.sort;

	const result = await db.query.jobOffers.findMany({
		where: and(
			eq(jobOffers.companyId, companyId),
			sort ? eq(jobOffers.published, sort === 'public') : undefined
		),
		with: {
			company: true,
		},
	});

	res.status(200).json({ jobOffers: result });
};

export const getCompanyRecruitments = async (req: Request, res: Response) => {
	const companyId = req.params.id;

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
		.where(eq(companies.id, companyId));

	res.status(200).json({ recruitments: result });
};
