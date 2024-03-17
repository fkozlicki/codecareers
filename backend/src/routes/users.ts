import { Router } from 'express';
import { requireSession } from '../middleware/session';
import { updateUser } from '../controllers/usersController';
import { upload } from '../lib/multer';
import { validate } from '../middleware/validate';
import { updateUserSchema } from '../validators/users';

export const usersRouter = Router();

usersRouter
	.route('/:id')
	.put(
		requireSession,
		upload.single('avatar'),
		validate(updateUserSchema),
		updateUser
	);
