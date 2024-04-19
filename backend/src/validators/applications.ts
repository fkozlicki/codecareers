import { z } from 'zod';

export const getApplicationsSchema = z.object({
	query: z.object({
		sort: z.enum(['accepted', 'rejected']).optional(),
	}),
});

export type GetApplicationsSchema = z.infer<typeof getApplicationsSchema>;
