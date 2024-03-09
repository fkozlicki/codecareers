import { eq } from 'drizzle-orm';
import { db } from '../db';
import {
	companies,
	jobOfferSkills,
	jobOfferTechnologies,
	jobOffers,
	skills,
	technologies,
} from '../db/schema';
import { Request, Response } from 'express';
import { z } from 'zod';

export const getCompany = async (req: Request, res: Response) => {
	const id = req.params.id;

	if (!id) {
		return res.status(400).json({ message: 'Company ID required' });
	}

	const company = await db.query.companies.findFirst({
		where: eq(companies.id, id),
	});

	if (!company) {
		return res.status(404).json({ message: `Company with id ${id} not found` });
	}

	res.status(200).json({ company });
};

export const getCompanies = async (req: Request, res: Response) => {
	if (req.params.userId) {
		if (req.params.userId !== res.locals.user.id) {
			return res
				.status(403)
				.json({ message: 'You are not authorized to update this company' });
		}

		const userCompanies = await db.query.companies.findMany({
			where: eq(companies.id, req.params.id),
		});

		return res.status(200).json({ companies: userCompanies });
	}

	const allCompanies = await db.query.companies.findMany();

	res.status(200).json({ companies: allCompanies });
};

export const createCompany = async (req: Request, res: Response) => {
	const [newCompany] = await db
		.insert(companies)
		.values({ ownerId: res.locals.user.id, ...req.body })
		.returning();

	res.status(201).json({ company: newCompany });
};

export const updateCompany = async (req: Request, res: Response) => {
	const id = req.params.id;

	if (!id) {
		return res.status(400).json({ message: 'Company ID required' });
	}

	const company = await db.query.companies.findFirst({
		where: eq(companies.id, req.params.id),
	});

	if (!company) {
		return res.status(404).json({ message: `Company with id ${id} not found` });
	}

	if (company.ownerId !== res.locals.user.id) {
		return res
			.status(403)
			.json({ message: 'You are not authorized to update this company' });
	}

	const [updatedCompany] = await db
		.update(companies)
		.set(req.body)
		.where(eq(companies.id, id))
		.returning();

	res.status(200).json({ company: updatedCompany });
};

export const deleteCompany = async (req: Request, res: Response) => {
	const id = req.params.id;

	if (!id) {
		return res.status(400).json({ message: 'Company ID required' });
	}

	const company = await db.query.companies.findFirst({
		where: eq(companies.id, req.params.id),
	});

	if (!company) {
		return res.status(404).json({ message: `Company with id ${id} not found` });
	}

	if (company.ownerId !== res.locals.user.id) {
		return res
			.status(403)
			.json({ message: 'You are not authorized to delete this company' });
	}

	await db.delete(companies).where(eq(companies.id, id)).returning();
	res.status(204).json({ message: 'Company deleted successfully' });
};

const skillItem = z.object({
	label: z.string(),
	value: z.string(),
	__isNew__: z.boolean().optional(),
});

export const jobOfferSchema = z.object({
	body: z.object({
		position: z.string(),
		description: z.string(),
		level: z.enum(['junior', 'mid', 'senior']),
		employmentType: z.enum([
			'b2b',
			'permanent',
			'mandate',
			'internship',
			'task',
		]),
		workType: z.enum(['full_time', 'part_time', 'internship', 'freelance']),
		salaryFrom: z.number().int(),
		salaryTo: z.number().int(),
		salaryCurrency: z.enum(['pln', 'gbp', 'eur', 'usd']),
		skills: z.array(skillItem),
		technologies: z.array(skillItem),
	}),
	params: z.object({
		id: z.string(),
	}),
});
type CreateJobOfferSchema = z.infer<typeof jobOfferSchema>;

export const createJobOffer = async (req: Request, res: Response) => {
	const { id: companyId } = req.params as CreateJobOfferSchema['params'];

	if (!companyId) {
		return res.status(400).json({ message: 'Company ID required' });
	}

	const {
		technologies: _technologies,
		skills: _skills,
		...rest
	} = req.body as CreateJobOfferSchema['body'];

	const [jobOffer] = await db
		.insert(jobOffers)
		.values({ companyId, ...rest })
		.returning();

	const newTechnologies = _technologies.filter(
		(technology) => technology.__isNew__
	);
	const existingTechnologies = _technologies.filter(
		(technology) => !technology.__isNew__
	);

	const createdTechnologies = await db
		.insert(technologies)
		.values(newTechnologies.map((tech) => ({ name: tech.value })))
		.returning();

	await db.insert(jobOfferTechnologies).values(
		existingTechnologies
			.map((tech) => ({
				jobOfferId: jobOffer.id,
				technologyId: tech.value,
			}))
			.concat(
				createdTechnologies.map((tech) => ({
					jobOfferId: jobOffer.id,
					technologyId: tech.id,
				}))
			)
	);

	const newSkills = _skills.filter((skill) => skill.__isNew__);
	const existingSkills = _skills.filter((skill) => !skill.__isNew__);

	const createdSkills = await db
		.insert(skills)
		.values(newSkills.map((skill) => ({ name: skill.value })))
		.returning();

	await db.insert(jobOfferSkills).values(
		existingSkills
			.map((skill) => ({
				jobOfferId: jobOffer.id,
				skillId: skill.value,
			}))
			.concat(
				createdSkills.map((skill) => ({
					jobOfferId: jobOffer.id,
					skillId: skill.id,
				}))
			)
	);

	res.status(201).json({ jobOffer });
};

export const getJobOffers = async (req: Request, res: Response) => {
	const companyId = req.params.id;

	const result = await db.query.jobOffers.findMany({
		where: eq(jobOffers.companyId, companyId),
	});

	res.status(200).json({ jobOffers: result });
};
