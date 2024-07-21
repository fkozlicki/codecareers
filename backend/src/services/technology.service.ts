import { eq } from 'drizzle-orm';
import { db } from '../db/index';
import { technologies } from '../db/schema/technology';
import { CreateJobOfferSchema } from '../validators/companies';

export const createTechnologies = async (
	body: CreateJobOfferSchema['body']['technologies']
) => {
	const newTechnologies = await db
		.insert(technologies)
		.values(body.map(({ value }) => ({ name: value, public: false })))
		.returning();

	return newTechnologies;
};

export const findTechnologies = async () => {
	return await db.query.technologies.findMany({
		where: eq(technologies.public, true),
	});
};
