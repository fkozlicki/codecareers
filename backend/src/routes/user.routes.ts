import { Router } from 'express';
import { requireSession } from '../middleware/session.js';
import { updateUser } from '../controllers/user.controller.js';
import { upload } from '../lib/multer.js';
import { validate } from '../middleware/validate.js';
import { updateUserSchema } from '../validators/users.js';

export const usersRouter = Router();

usersRouter
	.route('/:id')
	.put(
		requireSession,
		upload.single('avatar'),
		validate(updateUserSchema),
		updateUser
	);
