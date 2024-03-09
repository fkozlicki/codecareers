import { z } from 'zod';
import { api } from './api';
import { JobOffer } from './jobOffers';

export interface Company {
	id: string;
	name: string;
	description: string;
	phoneNumber: string;
}

export const createCompanySchema = z.object({
	name: z.string().min(1),
	description: z.string(),
	phoneNumber: z
		.string()
		.regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/),
});

export type CompanyValues = z.infer<typeof createCompanySchema>;

const arrayItem = z.object({
	label: z.string(),
	value: z.string(),
	__isNew__: z.boolean().optional(),
});

export const createJobOfferSchema = z.object({
	position: z.string().min(1, 'Position is required'),
	description: z.string().min(1, 'Description is required'),
	level: z.string().min(1, 'Experience level is required'),
	skills: z.array(arrayItem).min(1, 'Select at least 1 skill'),
	technologies: z.array(arrayItem).min(1, 'Select at least 1 technology'),
	salaryFrom: z.coerce.number().int().min(1, 'Cmon, be a human'),
	salaryTo: z.coerce.number().int().min(1, 'Cmon, be a human'),
	salaryCurrency: z.string().min(1, 'Currency is required'),
	employmentType: z.string().min(1, 'Employment type is required'),
	workType: z.string().min(1, 'Work type is required'),
});

export type JobOfferValues = z.infer<typeof createJobOfferSchema>;

export const companiesApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getCompanies: builder.query<{ companies: Company[] }, string | undefined>({
			query: (id) => `companies${id ? `?userId=${id}` : ''}`,
			providesTags: ['Company'],
		}),
		getCompany: builder.query<{ company: Company }, string>({
			query: (id) => `companies/${id}`,
			providesTags: ['Company'],
		}),
		createCompany: builder.mutation<{ company: Company }, CompanyValues>({
			query: (data) => ({
				url: 'companies',
				method: 'POST',
				body: data,
			}),
		}),
		updateCompany: builder.mutation<
			{ company: Company },
			CompanyValues & { id: string }
		>({
			query: (data) => {
				const { id, ...body } = data;
				return {
					url: `companies/${id}`,
					method: 'PUT',
					body,
				};
			},
			async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
				const result = dispatch(
					companiesApi.util.updateQueryData('getCompany', id, (draft) => {
						Object.assign(draft.company, patch);
					})
				);
				try {
					await queryFulfilled;
				} catch {
					result.undo();
				}
			},
		}),
		deleteCompany: builder.mutation<void, string>({
			query: (id) => ({
				url: `companies/${id}`,
				method: 'DELETE',
			}),
		}),
		createJobOffer: builder.mutation<
			JobOffer,
			JobOfferValues & { companyId: string }
		>({
			query: (data) => {
				const { companyId, ...body } = data;
				return {
					url: `companies/${companyId}/job-offers`,
					method: 'POST',
					body,
				};
			},
		}),
		getJobOffers: builder.query<{ jobOffers: JobOffer[] }, string>({
			query: (id) => `companies/${id}/job-offers`,
			providesTags: ['JobOffer'],
		}),
	}),
});

export const {
	useGetCompaniesQuery,
	useCreateCompanyMutation,
	useGetCompanyQuery,
	useUpdateCompanyMutation,
	useCreateJobOfferMutation,
	useGetJobOffersQuery,
} = companiesApi;
