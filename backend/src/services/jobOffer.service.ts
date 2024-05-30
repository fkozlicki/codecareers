import { and, count, eq, gt, ilike } from 'drizzle-orm';
import { db } from '../db/index.js';
import { jobOffers } from '../db/schema/jobOffer.js';
import { jobOfferSkills } from '../db/schema/jobOfferSkill.js';
import { jobOfferTechnologies } from '../db/schema/jobOfferTechnology.js';
import { users } from '../db/schema/user.js';
import {
	CreateJobOfferSchema,
	GetCompanyJobOffersSchema,
} from '../validators/companies.js';
import {
	GetJobOffersSchema,
	UpdateJobOfferSchema,
} from '../validators/jobOffers.js';
import * as skillService from './skill.service.js';
import * as technologyService from './technology.service.js';

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

export const findJobOffersByCompanyId = async (
	companyId: string,
	sort: GetCompanyJobOffersSchema['query']['sort']
) => {
	return await db.query.jobOffers.findMany({
		where: and(
			eq(jobOffers.deleted, false),
			eq(jobOffers.companyId, companyId),
			sort ? eq(jobOffers.published, sort === 'public') : undefined
		),
		with: {
			company: true,
		},
	});
};

export const findJobOfferById = async (id: string) => {
	return await db.query.jobOffers.findFirst({
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
};

export const updateJobOffer = async (
	id: string,
	body: Omit<UpdateJobOfferSchema['body'], 'skills' | 'technologies'>
) => {
	const [updatedJobOffer] = await db
		.update(jobOffers)
		.set(body)
		.where(eq(jobOffers.id, id))
		.returning();

	return updatedJobOffer;
};

export const deleteJobOffer = async (id: string) => {
	await db.update(jobOffers).set({ deleted: true }).where(eq(jobOffers.id, id));
};

export const findJobOffers = async (query: GetJobOffersSchema['query']) => {
	const { cursor, pageSize, position } = query;

	const result = await db.query.jobOffers.findMany({
		where: and(
			eq(jobOffers.deleted, false),
			eq(jobOffers.published, true),
			position ? ilike(jobOffers.position, `%${position}%`) : undefined,
			cursor ? gt(jobOffers.id, cursor) : undefined
		),
		limit: pageSize ? +pageSize : 10,
		orderBy: users.id,
		with: {
			company: true,
		},
	});

	const nextCursor = result.at(-1)?.id;
	let hasNextPage = false;

	if (nextCursor) {
		const [result] = await db
			.select({ count: count() })
			.from(jobOffers)
			.where(gt(jobOffers.id, nextCursor))
			.limit(1);
		if (result.count > 0) {
			hasNextPage = true;
		}
	}

	return { jobOffers: result, cursor: nextCursor, hasNextPage };
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

export const deleteJobOfferSkills = async (jobOfferId: string) => {
	await db
		.delete(jobOfferSkills)
		.where(eq(jobOfferSkills.jobOfferId, jobOfferId));
};

export const deleteJobOfferTechnologies = async (jobOfferId: string) => {
	await db
		.delete(jobOfferTechnologies)
		.where(eq(jobOfferTechnologies.jobOfferId, jobOfferId));
};
