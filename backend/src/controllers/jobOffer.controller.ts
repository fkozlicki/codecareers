import { Request, Response } from 'express';
import * as applicationService from '../services/application.service';
import * as jobOfferService from '../services/jobOffer.service';
import {
	CreateApplicationSchema,
	GetJobOfferApplications,
	GetJobOffersSchema,
	UpdateJobOfferSchema,
} from '../validators/jobOffers';

export const getJobOffers = async (
	req: Request<{}, {}, {}, GetJobOffersSchema['query']>,
	res: Response
) => {
	try {
		const { cursor, hasNextPage, jobOffers } =
			await jobOfferService.findJobOffers(req.query);
		res.status(200).json({ cursor, hasNextPage, jobOffers });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

export const getJobOffer = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const jobOffer = await jobOfferService.findJobOfferById(id);

		if (!jobOffer) {
			return res
				.status(404)
				.json({ message: `Job offer with id ${id} not found` });
		}

		res.status(200).json({ jobOffer });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

export const updateJobOffer = async (
	req: Request<
		UpdateJobOfferSchema['params'],
		{},
		UpdateJobOfferSchema['body']
	>,
	res: Response
) => {
	const { id } = req.params;

	const { technologies, skills, ...rest } = req.body;

	try {
		// TODO: check if jobOffer->company belongs to user

		const updatedJobOffer = await jobOfferService.updateJobOffer(id, rest);

		if (skills) {
			await jobOfferService.deleteJobOfferSkills(id);
			await jobOfferService.createJobOfferSkills(id, skills);
		}

		if (technologies) {
			await jobOfferService.deleteJobOfferTechnologies(id);
			await jobOfferService.createJobOfferTechnologies(id, technologies);
		}

		res.status(200).json({ jobOffer: updatedJobOffer });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

export const deleteJobOffer = async (req: Request, res: Response) => {
	const { id } = req.params;

	console.log('Delete job offer');

	try {
		await jobOfferService.deleteJobOffer(id);

		res.status(204).json({ message: 'Deleted job offer' });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

export const createApplication = async (
	req: Request<
		CreateApplicationSchema['params'],
		{},
		CreateApplicationSchema['body']
	>,
	res: Response
) => {
	const { id } = req.params;

	try {
		const newApplication = await applicationService.createApplication(
			id,
			res.locals.user.id,
			req.body,
			req.file
		);

		res.status(201).json({ application: newApplication });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

export const getApplications = async (
	req: Request<
		GetJobOfferApplications['params'],
		{},
		{},
		GetJobOfferApplications['query']
	>,
	res: Response
) => {
	const { id } = req.params;
	const { sort } = req.query;

	try {
		const jobOfferApplications =
			await applicationService.findApplicationsByJobOfferId(id, sort);

		res.status(200).json({ applications: jobOfferApplications });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};
