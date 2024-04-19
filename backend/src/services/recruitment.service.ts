import { eq } from 'drizzle-orm';
import { db } from '../db';
import {
	applications,
	companies,
	jobOffers,
	recruitments,
	users,
} from '../db/schema';

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
		with: {
			application: {
				with: {
					user: true,
					jobOffer: {
						with: {
							company: true,
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
			jobOffer: {
				...jobOffers,
				company: companies,
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
