import { z } from 'zod';

const signInBody = z.object({
	email: z.string(),
	password: z.string(),
});

export const credentialsSignInSchema = z.object({
	body: signInBody,
});

const signUpBody = signInBody.extend({
	firstName: z.string(),
	lastName: z.string(),
});

export const signUpSchema = z.object({
	body: signUpBody,
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
