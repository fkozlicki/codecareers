import { Request, Response } from 'express';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { uploadFileToS3 } from '../lib/s3';
import { generateId } from 'lucia';

export const updateUser = async (req: Request, res: Response) => {
	const id = req.params.id;
	const avatar = req.file;
	const filename = generateId(15);

	if (avatar) {
		try {
			await uploadFileToS3(`avatars/${filename}`, avatar.buffer);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Server error' });
		}
	}

	const [updatedUser] = await db
		.update(users)
		.set({
			...req.body,
			...(avatar
				? { avatar: `http://localhost:3000/avatars/${filename}` }
				: {}),
		})
		.where(eq(users.id, id))
		.returning();

	res.status(200).json({ user: updatedUser });
};
