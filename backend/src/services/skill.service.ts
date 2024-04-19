import { db } from '../db';
import { skills } from '../db/schema';
import { CreateJobOfferSchema } from '../validators/companies';

export const createSkills = async (
	body: CreateJobOfferSchema['body']['skills']
) => {
	const newSkills = await db
		.insert(skills)
		.values(body.map(({ value }) => ({ name: value })))
		.returning();

	return newSkills;
};
