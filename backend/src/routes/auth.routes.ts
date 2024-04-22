import { Router } from 'express';
import {
	credentialsSignIn,
	getSession,
	githubCallback,
	githubSignIn,
	googleCallback,
	googleSignIn,
	logout,
	signUp,
} from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { credentialsSignInSchema, signUpSchema } from '../validators/auth.js';

export const authRouter = Router();

authRouter.post('/signup', validate(signUpSchema), signUp);
authRouter.post(
	'/login/credentials',
	validate(credentialsSignInSchema),
	credentialsSignIn
);
authRouter.get('/login/github', githubSignIn);
authRouter.get('/login/github/callback', githubCallback);
authRouter.get('/login/google', googleSignIn);
authRouter.get('/login/google/callback', googleCallback);
authRouter.get('/session', getSession);
authRouter.get('/logout', logout);
