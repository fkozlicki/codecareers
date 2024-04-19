import { z } from 'zod';

const userBody = z.object({
	firstName: z.string(),
	lastName: z.string(),
});

export const updateUserSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
	body: userBody.partial(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
