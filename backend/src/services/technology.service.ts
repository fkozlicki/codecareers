import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { technologies } from '../db/schema.js';
import { CreateJobOfferSchema } from '../validators/companies.js';

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
