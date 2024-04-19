import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';
import { UpdateUserSchema } from '../validators/users';
import { generateId } from 'lucia';
import { uploadFileToS3 } from '../lib/s3';

export const findUserById = async (id: string) => {
	return await db.query.users.findFirst({ where: eq(users.id, id) });
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
		avatar = `http://localhost:3000/avatars/${filename}`;
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
