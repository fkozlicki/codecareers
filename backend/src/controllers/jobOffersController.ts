import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import { generateId } from 'lucia';
import { db } from '../db';
import { jobOffers } from '../db/schema';

export const getJobOffer = async (req: Request, res: Response) => {
	const id = req.params.id;

	if (!id) {
		return res.status(400).json({ message: 'Company ID required' });
	}

	const jobOffer = await db.query.jobOffers.findFirst({
		where: eq(jobOffers.id, id),
		with: {
			jobOfferSkills: true,
			jobOfferTechnologies: true,
		},
	});

	if (!jobOffer) {
		return res
			.status(404)
			.json({ message: `Job offer with id ${id} not found` });
	}

	res.status(200).json({ jobOffer });
};

export const updateJobOffer = () => {};
export const deleteJobOffer = () => {};
