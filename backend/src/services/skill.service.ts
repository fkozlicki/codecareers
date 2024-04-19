import { eq } from 'drizzle-orm';
import { db } from '../db';
import { skills } from '../db/schema';
import { CreateJobOfferSchema } from '../validators/companies';

export const createSkills = async (
	body: CreateJobOfferSchema['body']['skills']
) => {
	const newSkills = await db
		.insert(skills)
		.values(body.map(({ value }) => ({ name: value, public: false })))
		.returning();

	return newSkills;
};

export const findSkills = async () => {
	return await db.query.skills.findMany({
		where: eq(skills.public, false),
	});
};
