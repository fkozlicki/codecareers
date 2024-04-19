import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { jobOfferSkills, jobOfferTechnologies, jobOffers } from '../db/schema';
import {
	CreateJobOfferSchema,
	GetCompanyJobOffersSchema,
} from '../validators/companies';
import * as skillService from './skill.service';
import * as technologyService from './technology.service';

export const createJobOffer = async (
	companyId: string,
	body: Omit<CreateJobOfferSchema['body'], 'skills' | 'technologies'>
) => {
	const [newJobOffer] = await db
		.insert(jobOffers)
		.values({ companyId, ...body })
		.returning();

	return newJobOffer;
};

export const getJobOffersByCompanyId = async (
	companyId: string,
	sort: GetCompanyJobOffersSchema['query']['sort']
) => {
	return await db.query.jobOffers.findMany({
		where: and(
			eq(jobOffers.companyId, companyId),
			sort ? eq(jobOffers.published, sort === 'public') : undefined
		),
		with: {
			company: true,
		},
	});
};

export const createJobOfferSkills = async (
	jobOfferId: string,
	body: CreateJobOfferSchema['body']['skills']
) => {
	const newSkills = body.filter(({ __isNew__ }) => __isNew__);
	const existingSkills = body.filter(({ __isNew__ }) => !__isNew__);

	let createdSkills;

	if (newSkills.length > 0) {
		createdSkills = await skillService.createSkills(newSkills);
	}

	const skillsBody = [
		...existingSkills.map(({ value }) => ({
			skillId: value,
			jobOfferId,
		})),
		...(createdSkills
			? createdSkills.map(({ id }) => ({
					skillId: id,
					jobOfferId,
			  }))
			: []),
	];

	await db.insert(jobOfferSkills).values(skillsBody);
};

export const createJobOfferTechnologies = async (
	jobOfferId: string,
	body: CreateJobOfferSchema['body']['technologies']
) => {
	const newTechnologies = body.filter(({ __isNew__ }) => __isNew__);
	const existingTechnologies = body.filter(({ __isNew__ }) => !__isNew__);
	let createdTechnologies;

	if (newTechnologies.length > 0) {
		createdTechnologies = await technologyService.createTechnologies(
			newTechnologies
		);
	}

	const technologiesBody = [
		...existingTechnologies.map(({ value }) => ({
			technologyId: value,
			jobOfferId,
		})),
		...(createdTechnologies
			? createdTechnologies?.map(({ id }) => ({
					technologyId: id,
					jobOfferId,
			  }))
			: []),
	];

	await db.insert(jobOfferTechnologies).values(technologiesBody);
};
