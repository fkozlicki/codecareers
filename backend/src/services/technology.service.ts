import { db } from '../db';
import { technologies } from '../db/schema';
import { CreateJobOfferSchema } from '../validators/companies';

export const createTechnologies = async (
	body: CreateJobOfferSchema['body']['technologies']
) => {
	const newTechnologies = await db
		.insert(technologies)
		.values(body.map(({ value }) => ({ name: value })))
		.returning();

	return newTechnologies;
};
