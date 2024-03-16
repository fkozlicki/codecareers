import { Router } from 'express';
import { requireSession } from '../middleware/session';
import { updateUser } from '../controllers/usersController';
import { upload } from '../lib/multer';

export const usersRouter = Router();

usersRouter
	.route('/:id')
	.put(requireSession, upload.single('avatar'), updateUser);
