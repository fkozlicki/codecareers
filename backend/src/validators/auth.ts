import { z } from 'zod';

const signInBody = z.object({
	email: z.string(),
	password: z.string(),
});

const signUpBody = signInBody.extend({
	firstName: z.string(),
	lastName: z.string(),
});

export const credentialsSignInSchema = z.object({
	body: signInBody,
});

export const credentialsSignUpSchema = z.object({
	body: signUpBody,
});
