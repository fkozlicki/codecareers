import { and, eq, gt, isNull } from 'drizzle-orm';
import { Request, Response } from 'express';
import { db } from '../db';
import { applications, jobOffers, users } from '../db/schema';
import { uploadFileToS3 } from '../lib/s3';
import { generateId } from 'lucia';

export const getJobOffers = async (req: Request, res: Response) => {
	const cursor = req.query.cursor as string | undefined;
	const pageSize = req.query.pageSize ? +req.query.pageSize : undefined;
	const position = req.query.position as string | undefined;

	const result = await db.query.jobOffers.findMany({
		where: and(
			eq(jobOffers.published, true),
			position ? eq(jobOffers.position, position) : undefined,
			cursor ? gt(jobOffers.id, cursor) : undefined
		),
		limit: pageSize,
		orderBy: users.id,
		with: {
			company: true,
		},
	});

	res.status(200).json({ jobOffers: result });
};

export const getJobOffer = async (req: Request, res: Response) => {
	const id = req.params.id;

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

export const createApplication = async (req: Request, res: Response) => {
	const id = req.params.id;
	const file = req.file;

	const filename = generateId(15);

	if (file) {
		try {
			await uploadFileToS3(`cvs/${filename}`, file.buffer);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Server error' });
		}
	}

	const application = await db.insert(applications).values({
		userId: res.locals.user.id,
		jobOfferId: id,
		...req.body,
		...(file ? { cv: filename } : {}),
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
