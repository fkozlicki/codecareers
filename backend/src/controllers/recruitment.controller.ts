import { and, count, desc, eq, gt } from 'drizzle-orm';
import { Request, Response } from 'express';
import { db } from '../db';
import {
	applications,
	chats,
	jobOffers,
	messages,
	recruitments,
} from '../db/schema';
import { io } from '..';

export const getRecruitments = async (req: Request, res: Response) => {
	const result = await db
		.select({ id: recruitments.id, jobOffer: jobOffers })
		.from(recruitments)
		.leftJoin(applications, eq(recruitments.applicationId, applications.id))
		.leftJoin(jobOffers, eq(applications.jobOfferId, jobOffers.id))
		.where(eq(applications.userId, res.locals.user.id));

	res.status(200).json({ recruitments: result });
};

export const getRecruitment = async (req: Request, res: Response) => {
	const { id } = req.params;

	const recruitment = await db.query.recruitments.findFirst({
		where: eq(recruitments.id, id),
		with: {
			application: {
				with: {
					user: true,
					jobOffer: true,
				},
			},
		},
	});

	if (!recruitment) {
		return res.status(404).json({ message: 'Not found' });
	}

	res.status(200).json({ recruitment });
};
