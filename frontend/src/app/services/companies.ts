import { z } from 'zod';
import { api } from './api';
import { JobOffer } from './jobOffers';
import { User } from './auth';

export interface Company {
	id: string;
	name: string;
	description: string;
	phoneNumber: string;
	avatarUrl: string | null;
	backgroundUrl: string | null;
}

export const createCompanySchema = z.object({
	name: z.string().min(1),
	description: z.string(),
	phoneNumber: z
		.string()
		.regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/),
	avatar: z.instanceof(Blob).optional(),
	banner: z.instanceof(Blob).optional(),
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

export type CreateJobOfferValues = z.infer<typeof createJobOfferSchema>;

export type UpdateJobOfferValues = CreateJobOfferValues & { id: string };

export interface Recruitment {
	id: string;
	jobOffer: JobOffer;
	user: User;
	createdAt: string;
	open: boolean;
}

export const companiesApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getCompanies: builder.query<{ companies: Company[] }, string | undefined>({
			query: (id) => `companies${id ? `?userId=${id}` : ''}`,
			providesTags: (result = { companies: [] }) => [
				...result.companies.map(
					({ id }) => ({ type: 'Companies', id } as const)
				),
				{ type: 'Companies' as const, id: 'LIST' },
			],
		}),
		getCompany: builder.query<{ company: Company }, string>({
			query: (id) => `companies/${id}`,
			providesTags: (_result, _err, id) => [{ type: 'Companies', id }],
		}),
		createCompany: builder.mutation<{ company: Company }, CompanyValues>({
			query: (data) => {
				const formData = new FormData();
				Object.entries(data).forEach(([key, value]) => {
					if (value) {
						formData.append(key, value);
					}
				});

				return {
					url: 'companies',
					method: 'POST',
					body: formData,
				};
			},
			invalidatesTags: [{ type: 'Companies', id: 'LIST' }],
		}),
		updateCompany: builder.mutation<
			{ company: Company },
			CompanyValues & { id: string }
		>({
			query: (data) => {
				const { id, ...body } = data;
				const formData = new FormData();
				Object.entries(body).forEach(([key, value]) => {
					if (value) {
						formData.append(key, value);
					}
				});
				return {
					url: `companies/${id}`,
					method: 'PUT',
					body: formData,
				};
			},
			invalidatesTags: (result) => [
				{ type: 'Companies', id: result?.company.id },
			],
		}),
		deleteCompany: builder.mutation<{ company: Company }, string>({
			query: (id) => ({
				url: `companies/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result) => [
				{ type: 'Companies', id: result?.company.id },
			],
		}),
		createJobOffer: builder.mutation<
			JobOffer,
			CreateJobOfferValues & { companyId: string }
		>({
			query: (data) => {
				const { companyId, ...body } = data;
				return {
					url: `companies/${companyId}/job-offers`,
					method: 'POST',
					body,
				};
			},
			invalidatesTags: [{ type: 'JobOffers', id: 'LIST' }],
		}),
		getCompanyJobOffers: builder.query<
			{ jobOffers: JobOffer[] },
			{ id: string; sort: string | null }
		>({
			query: ({ id, sort }) =>
				`companies/${id}/job-offers${sort ? `?sort=${sort}` : ''}`,
			providesTags: (result = { jobOffers: [] }) => [
				...result.jobOffers.map(
					({ id }) => ({ type: 'JobOffers', id } as const)
				),
				{ type: 'JobOffers', id: 'LIST' },
			],
		}),
		getCompanyRecruitments: builder.query<
			{ recruitments: Recruitment[] },
			string
		>({
			query: (id) => `companies/${id}/recruitments`,
			providesTags: (result = { recruitments: [] }) => [
				...result.recruitments.map(
					({ id }) =>
						({
							type: 'Recruitments',
							id,
						} as const)
				),
				{ type: 'Recruitments', id: 'LIST' },
			],
		}),
	}),
});

export const {
	useGetCompaniesQuery,
	useCreateCompanyMutation,
	useGetCompanyQuery,
	useUpdateCompanyMutation,
	useCreateJobOfferMutation,
	useGetCompanyRecruitmentsQuery,
	useGetCompanyJobOffersQuery,
} = companiesApi;
