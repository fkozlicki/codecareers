import { Request, Response } from 'express';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { applications } from '../db/schema';

export const getApplications = async (req: Request, res: Response) => {
	const result = await db.query.applications.findMany({
		where: eq(applications.userId, res.locals.user.id),
		with: {
			jobOffer: {
				with: {
					company: true,
				},
			},
		},
	});

	res.status(200).json({ applications: result });
};

export const updateApplication = async (req: Request, res: Response) => {
	const id = req.params.id;

	const [updatedApplication] = await db
		.update(applications)
		.set(req.body)
		.where(eq(applications.id, id))
		.returning();

	res.status(200).json({ application: updatedApplication });
};
