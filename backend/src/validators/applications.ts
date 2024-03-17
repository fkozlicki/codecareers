import { z } from 'zod';

export const updateApplicationSchema = z.object({
	body: z.object({
		accepted: z.boolean(),
	}),
	params: z.object({
		id: z.string(),
	}),
});

export const getApplicationsSchema = z.object({
	query: z.object({
		sort: z.enum(['accepted', 'rejected']).optional(),
	}),
});
