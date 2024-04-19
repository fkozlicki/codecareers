import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';
import { db } from '../db';
import { applications, chatUsers, chats, recruitments } from '../db/schema';
import * as applicationService from '../services/application.service';
import { GetApplicationsSchema } from '../validators/applications';
import * as chatService from '../services/chat.service';
import * as recruitmentService from '../services/recruitment.service';

export const getApplications = async (
	req: Request<{}, {}, {}, GetApplicationsSchema['query']>,
	res: Response
) => {
	const { sort } = req.query;

	try {
		const result = await applicationService.findApplicationsByUserId(
			res.locals.user.id,
			sort
		);

		res.status(200).json({ applications: result });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

export const acceptApplication = async (req: Request, res: Response) => {
	const { id } = req.params;

	const application = await applicationService.findApplicationById(id, true);

	if (!application) {
		return res.status(404).json({ message: 'Not found' });
	}

	const newChat = await chatService.createChat(
		res.locals.user.id,
		application.jobOffer.company.ownerId
	);

	await recruitmentService.createRecruitment(application.id, newChat.id);

	const updatedApplication = await applicationService.updateApplication(
		id,
		true
	);

	res.status(201).json({ application: updatedApplication });
};

export const rejectApplication = async (req: Request, res: Response) => {
	const { id } = req.params;

	const application = await applicationService.findApplicationById(id, false);

	if (!application) {
		return res.status(404).json({ message: 'Not found' });
	}

	const updatedApplication = await applicationService.updateApplication(
		id,
		false
	);

	res.status(200).json({ application: updatedApplication });
};
