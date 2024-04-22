import { Request, Response } from 'express';
import * as userService from '../services/user.service.js';
import { UpdateUserSchema } from '../validators/users.js';

export const updateUser = async (
	req: Request<UpdateUserSchema['params'], {}, UpdateUserSchema['body']>,
	res: Response
) => {
	const { id } = req.params;

	try {
		const updatedUser = await userService.updateUser(id, req.body, req.file);

		res.status(200).json({ user: updatedUser });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};
