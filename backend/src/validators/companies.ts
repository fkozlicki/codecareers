import { z } from 'zod';
import { jobOfferBody } from './jobOffers';

const companyBody = z.object({
	name: z.string(),
	description: z.string(),
	phoneNumber: z.string(),
});

const companyFiles = z
	.object({
		avatar: z.tuple([
			z.object({
				fieldname: z.literal('avatar'),
				buffer: z.instanceof(Buffer),
			}),
		]),
		banner: z.tuple([
			z.object({
				fieldname: z.literal('banner'),
				buffer: z.instanceof(Buffer),
			}),
		]),
	})
	.partial();

export type CompanyFiles = z.infer<typeof companyFiles>;

export const createCompanySchema = z.object({
	body: companyBody,
	files: companyFiles.optional(),
});

export const updateCompanySchema = z.object({
	body: companyBody.partial(),
	files: companyFiles.optional(),
	params: z.object({
		id: z.string(),
	}),
});

export const getCompanySchema = z.object({
	params: z.object({
		id: z.string(),
	}),
});

export const deleteCompanySchema = z.object({
	params: z.object({
		id: z.string(),
	}),
});

export const createJobOfferSchema = z.object({
	body: jobOfferBody,
	params: z.object({
		id: z.string(),
	}),
});

export const getCompanyJobOffersSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
	query: z.object({
		sort: z.enum(['public', 'draft']).optional(),
	}),
});
