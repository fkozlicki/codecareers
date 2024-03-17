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
	skills: z.array(skillItem),
	technologies: z.array(skillItem),
});

export type JobOfferBody = z.infer<typeof jobOfferBody>;

export const getJobOfferSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
});

export const updateJobOfferSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
	file: z
		.object({
			fieldname: z.literal('cv'),
			buffer: z.instanceof(Buffer),
		})
		.optional(),
	body: jobOfferBody.partial(),
});

export const getJobOfferApplications = z.object({
	params: z.object({
		id: z.string(),
	}),
	query: z.object({
		sort: z.enum(['accepted', 'rejected']).optional(),
	}),
});

const applicationBody = z.object({
	introduction: z.string(),
});

const applicationFile = z.object({
	fieldname: z.literal('cv'),
	buffer: z.instanceof(Buffer),
});

export const createApplicationSchema = z.object({
	body: applicationBody,
	file: applicationFile,
	params: z.object({
		id: z.string(),
	}),
});
