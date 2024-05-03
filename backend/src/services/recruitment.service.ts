import { SQL, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import {
	applications,
	companies,
	jobOffers,
	recruitments,
	users,
} from '../db/schema.js';

export const createRecruitment = async (
	applicationId: string,
	chatId: string
) => {
	return await db
		.insert(recruitments)
		.values({
			applicationId,
			chatId,
		})
		.returning();
};

export const findRecruitmentById = async (id: string) => {
	return await db.query.recruitments.findFirst({
		where: eq(recruitments.id, id),
		columns: {
			applicationId: false,
			chatId: false,
		},
		with: {
			application: {
				columns: {
					jobOfferId: false,
					userId: false,
					id: false,
					accepted: false,
				},
				with: {
					user: {
						columns: {
							id: false,
							password: false,
							githubId: false,
						},
					},
					jobOffer: {
						columns: {
							companyId: false,
							id: false,
							published: false,
						},
						with: {
							company: {
								columns: {
									id: false,
									ownerId: false,
								},
							},
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
					},
				},
			},
			chat: {
				with: {
					chatUsers: {
						with: {
							user: {
								columns: {
									password: false,
									githubId: false,
									email: false,
								},
							},
						},
					},
				},
			},
		},
	});
};

export const findRecruitmentsByUserId = async (userId: string) => {
	return await db
		.select({
			id: recruitments.id,
			createdAt: recruitments.createdAt,
			open: recruitments.open,
			jobOffer: {
				position: jobOffers.position,
				level: jobOffers.level,
				workType: jobOffers.workType,
				salaryFrom: jobOffers.salaryFrom,
				salaryTo: jobOffers.salaryTo,
				salaryCurrency: jobOffers.salaryCurrency,
				employmentType: jobOffers.employmentType,
				createdAt: jobOffers.createdAt,
				company: {
					name: companies.name,
				} as unknown as SQL<unknown>,
			},
		})
		.from(recruitments)
		.leftJoin(applications, eq(recruitments.applicationId, applications.id))
		.leftJoin(jobOffers, eq(applications.jobOfferId, jobOffers.id))
		.leftJoin(companies, eq(jobOffers.companyId, companies.id))
		.where(eq(applications.userId, userId));
};

export const findRecruitmentsByCompanyId = async (companyId: string) => {
	return await db
		.select({
			id: recruitments.id,
			createdAt: recruitments.createdAt,
			open: recruitments.open,
			jobOffer: {
				position: jobOffers.position,
			},
			user: {
				id: users.id,
				firstName: users.firstName,
				lastName: users.lastName,
				username: users.username,
				avatar: users.avatar,
			},
		})
		.from(recruitments)
		.leftJoin(applications, eq(recruitments.applicationId, applications.id))
		.leftJoin(jobOffers, eq(applications.jobOfferId, jobOffers.id))
		.leftJoin(companies, eq(jobOffers.companyId, companies.id))
		.leftJoin(users, eq(applications.userId, users.id))
		.where(eq(companies.id, companyId));
};
