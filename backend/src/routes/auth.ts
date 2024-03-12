import { Router } from 'express';
import {
	credentialsSignInSchema,
	credentialsSignUpSchema,
	handleCredentialsSignIn,
	handleCredentialsSignUp,
	handleGithubCallback,
	handleGithubSignIn,
	handleGoogleCallback,
	handleGoogleSignIn,
	handleLogout,
	handleSession,
} from '../controllers/authController';
import { validate } from '../middleware/validate';

export const authRouter = Router();

authRouter.post(
	'/signup',
	validate(credentialsSignUpSchema),
	handleCredentialsSignUp
);
authRouter.get(
	'/login/credentials',
	validate(credentialsSignInSchema),
	handleCredentialsSignIn
);
authRouter.get('/login/github', handleGithubSignIn);
authRouter.get('/login/github/callback', handleGithubCallback);
authRouter.get('/login/google', handleGoogleSignIn);
authRouter.get('/login/google/callback', handleGoogleCallback);
authRouter.get('/session', handleSession);
authRouter.get('/logout', handleLogout);
