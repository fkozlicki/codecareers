import { Router } from 'express';
import {
	handleCredentialsSignUp,
	handleGithubCallback,
	handleGithubSignIn,
	handleLogout,
	handleSession,
} from '../controllers/authController';

export const authRouter = Router();

authRouter.post('/signup', handleCredentialsSignUp);
authRouter.get('/login/github', handleGithubSignIn);
authRouter.get('/login/github/callback', handleGithubCallback);
authRouter.get('/session', handleSession);
authRouter.get('/logout', handleLogout);
