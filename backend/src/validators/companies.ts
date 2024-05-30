import { z } from 'zod';
import { jobOfferBody } from './jobOffers';

const companyBody = z.object({
	name: z.string(),
	description: z.string().optional(),
	phoneNumber: z.string(),
});

export const createCompanySchema = z.object({
	body: companyBody,
});

export type CreateCompanySchema = z.infer<typeof createCompanySchema>;

export const updateCompanySchema = z.object({
	body: companyBody.partial(),
	params: z.object({
		id: z.string(),
	}),
});

export type UpdateCompanySchema = z.infer<typeof updateCompanySchema>;

export const getCompanySchema = z.object({
	params: z.object({
		id: z.string(),
	}),
});

export type GetCompanySchema = z.infer<typeof getCompanySchema>;

export const deleteCompanySchema = z.object({
	params: z.object({
		id: z.string(),
	}),
});

export type DeleteCompanySchema = z.infer<typeof deleteCompanySchema>;

export const createJobOfferSchema = z.object({
	body: jobOfferBody,
	params: z.object({
		id: z.string(),
	}),
});

export type CreateJobOfferSchema = z.infer<typeof createJobOfferSchema>;

export const getCompanyJobOffersSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
	query: z.object({
		sort: z.enum(['public', 'draft']).optional(),
	}),
});

export type GetCompanyJobOffersSchema = z.infer<
	typeof getCompanyJobOffersSchema
>;

export const getCompanyRecruitmentsSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
});

export type GetCompanyRecruitmentsSchema = z.infer<
	typeof getCompanyRecruitmentsSchema
>;
