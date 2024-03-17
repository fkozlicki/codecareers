import { z } from 'zod';

const userBody = z.object({
	firstName: z.string(),
	lastName: z.string(),
});

export const updateUserSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
	file: z
		.object({
			fieldname: z.literal('avatar'),
			buffer: z.instanceof(Buffer),
		})
		.optional(),
	body: userBody.partial(),
});
