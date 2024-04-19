import { z } from 'zod';

const skillItem = z.object({
	label: z.string(),
	value: z.string(),
	__isNew__: z.boolean().optional(),
});

export const jobOfferBody = z.object({
	position: z.string(),
	description: z.string(),
	level: z.enum(['junior', 'mid', 'senior']),
	employmentType: z.enum(['b2b', 'permanent', 'mandate', 'internship', 'task']),
	workType: z.enum(['full_time', 'part_time', 'internship', 'freelance']),
	salaryFrom: z.number().int(),
	salaryTo: z.number().int(),
	salaryCurrency: z.enum(['pln', 'gbp', 'eur', 'usd']),
	skills: z.array(skillItem).min(1),
	technologies: z.array(skillItem).min(1),
});

export const getJobOfferSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
});

export const getJobOffersSchema = z.object({
	query: z.object({
		cursor: z.string().optional(),
		pageSize: z.number().optional(),
		position: z.string().optional(),
	}),
});

export type GetJobOffersSchema = z.infer<typeof getJobOffersSchema>;

export const updateJobOfferSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
	body: jobOfferBody.partial(),
});

export type UpdateJobOfferSchema = z.infer<typeof updateJobOfferSchema>;

const applicationBody = z.object({
	introduction: z.string(),
});

export const createApplicationSchema = z.object({
	body: applicationBody,
	params: z.object({
		id: z.string(),
	}),
});

export type CreateApplicationSchema = z.infer<typeof createApplicationSchema>;

export const getJobOfferApplications = z.object({
	params: z.object({
		id: z.string(),
	}),
	query: z.object({
		sort: z.enum(['accepted', 'rejected']).optional(),
	}),
});

export type GetJobOfferApplications = z.infer<typeof getJobOfferApplications>;
