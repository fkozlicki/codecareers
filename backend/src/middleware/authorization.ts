import { NextFunction, Request, Response } from 'express';
import { db } from '../db/index';
import { eq } from 'drizzle-orm';
import { applications } from '../db/schema/application';

export const authorizeCv = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const filename = req.params.filename;

	const application = await db.query.applications.findFirst({
		where: eq(applications.cv, filename),
		with: {
			jobOffer: {
				with: {
					company: {
						with: {
							owner: true,
						},
					},
				},
			},
		},
	});

	if (!application) {
		return res.status(404).json({ message: 'Not found' });
	}

	if (
		application.userId !== res.locals.user.id &&
		application.jobOffer.company.ownerId !== res.locals.user.id
	) {
		return res
			.status(403)
			.json({ message: 'You are not allowed to access this resource' });
	}

	next();
};
