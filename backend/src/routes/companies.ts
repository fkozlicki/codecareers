import { eq } from 'drizzle-orm';
import { db } from '../db';
import { companies } from '../db/schema';
import { Request, Response } from 'express';

export const getCompany = async (req: Request, res: Response) => {
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

	res.status(200).json({ company });
};

export const getCompanies = async (req: Request, res: Response) => {
	const companies = await db.query.companies.findMany();

	res.status(200).json({ companies });
};

export const createCompany = async (req: Request, res: Response) => {
	const [newCompany] = await db.insert(companies).values(req.body).returning();

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
