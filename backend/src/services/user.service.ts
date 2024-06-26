import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';
import { db } from '../db/index';
import { users } from '../db/schema/user';
import { uploadFileToS3 } from '../lib/s3';
import { SignUpSchema } from '../validators/auth';
import { UpdateUserSchema } from '../validators/users';

export const findUserById = async (id: string) => {
	return await db.query.users.findFirst({ where: eq(users.id, id) });
};

export const findUserByGithubId = async (githubId: number) => {
	return await db.query.users.findFirst({
		where: eq(users.githubId, githubId),
	});
};

export const findUserByEmail = async (email: string) => {
	return await db.query.users.findFirst({ where: eq(users.email, email) });
};

type GoogleUserBody = {
	firstName: string;
	lastName: string;
	email: string;
	avatar: string;
};

type GithubUserBody = {
	username: string;
	githubId: number;
	avatar: string;
};

export const createUser = async (
	body: SignUpSchema['body'] | GoogleUserBody | GithubUserBody
) => {
	const [newUser] = await db.insert(users).values(body).returning();
	return newUser;
};

export const updateUser = async (
	id: string,
	body: UpdateUserSchema['body'],
	file?: Express.Multer.File
) => {
	let avatar;

	if (file) {
		const filename = generateId(15);
		await uploadFileToS3(`avatars/${filename}`, file.buffer);
		avatar = `${process.env.API_URI}/avatars/${filename}`;
	}

	const [updatedUser] = await db
		.update(users)
		.set({
			...body,
			avatar,
		})
		.where(eq(users.id, id))
		.returning();

	return updatedUser;
};
