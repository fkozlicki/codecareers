import { and, eq, isNull } from 'drizzle-orm';
import { Request, Response } from 'express';
import { db } from '../db';
import { applications, jobOffers } from '../db/schema';

export const getJobOffers = async (req: Request, res: Response) => {
	const result = await db.query.jobOffers.findMany({
		where: eq(jobOffers.published, true),
	});

	res.status(200).json({ jobOffers: result });
};

export const getJobOffer = async (req: Request, res: Response) => {
	const id = req.params.id;

	if (!id) {
		return res.status(400).json({ message: 'Company ID required' });
	}

	const jobOffer = await db.query.jobOffers.findFirst({
		where: eq(jobOffers.id, id),
		with: {
			company: true,
			jobOfferSkills: {
				with: {
					skill: true,
				},
			},
			jobOfferTechnologies: {
				with: {
					technology: true,
				},
			},
		},
	});

	if (!jobOffer) {
		return res
			.status(404)
			.json({ message: `Job offer with id ${id} not found` });
	}

	res.status(200).json({ jobOffer });
};

export const updateJobOffer = async (req: Request, res: Response) => {
	const id = req.params.id;

	const [updatedJobOffer] = await db
		.update(jobOffers)
		.set(req.body)
		.where(eq(jobOffers.id, id))
		.returning();

	res.status(200).json({ jobOffer: updatedJobOffer });
};
export const deleteJobOffer = () => {};

export const createApplication = async (req: Request, res: Response) => {
	const id = req.params.id;

	const application = await db.insert(applications).values({
		userId: res.locals.user.id,
		jobOfferId: id,
		...req.body,
	});

	res.status(201).json({ application });
};

export const getApplications = async (req: Request, res: Response) => {
	const id = req.params.id;
	const sort = req.query.sort;

	const jobOfferApplications = await db.query.applications.findMany({
		where: and(
			eq(applications.jobOfferId, id),
			sort
				? eq(applications.accepted, sort === 'accepted')
				: isNull(applications.accepted)
		),
		with: {
			user: true,
		},
	});

	res.status(200).json({ applications: jobOfferApplications });
};
