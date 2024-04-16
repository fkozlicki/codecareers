import { and, eq, isNull } from 'drizzle-orm';
import { Request, Response } from 'express';
import { db } from '../db';
import { applications, chatUsers, chats, recruitments } from '../db/schema';

export const getApplications = async (req: Request, res: Response) => {
	const sort = req.query.sort;

	const result = await db.query.applications.findMany({
		where: and(
			eq(applications.userId, res.locals.user.id),
			sort
				? eq(applications.accepted, sort === 'accepted')
				: isNull(applications.accepted)
		),
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

export const acceptApplication = async (req: Request, res: Response) => {
	const id = req.params.id;

	// FIND APPLICATION
	const application = await db.query.applications.findFirst({
		where: eq(applications.id, id),
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

	// CREATE NEW CHAT
	const [newChat] = await db.insert(chats).values({}).returning();
	await db
		.insert(chatUsers)
		.values({ chatId: newChat.id, userId: res.locals.user.id });

	if (application.jobOffer.company.ownerId !== res.locals.user.id) {
		await db.insert(chatUsers).values({
			chatId: newChat.id,
			userId: application.jobOffer.company.ownerId,
		});
	}

	// CREATE RECRUITMENT
	await db
		.insert(recruitments)
		.values({
			applicationId: id,
			chatId: newChat.id,
		})
		.returning();

	// UPDATE APPLICATION
	const [updatedApplication] = await db
		.update(applications)
		.set({ accepted: true })
		.where(eq(applications.id, id))
		.returning();

	res.status(201).json({ application: updatedApplication });
};

export const rejectApplication = async (req: Request, res: Response) => {
	const id = req.params.id;

	const application = await db.query.applications.findFirst({
		where: eq(applications.id, id),
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

	const [updatedApplication] = await db
		.update(applications)
		.set({ accepted: false })
		.where(eq(applications.id, id))
		.returning();

	res.status(200).json({ application: updatedApplication });
};
