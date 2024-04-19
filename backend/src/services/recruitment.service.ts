import { eq } from 'drizzle-orm';
import { db } from '../db';
import {
	applications,
	companies,
	jobOffers,
	recruitments,
	users,
} from '../db/schema';

export const getRecruitmentsByCompanyId = async (companyId: string) => {
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
