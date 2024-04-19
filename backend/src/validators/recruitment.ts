import { z } from 'zod';

export const getRecruitmentSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
});
