import { api } from './api';
import { Company } from './companies';
import { z } from 'zod';

export const createApplicationSchema = z.object({
	cv: z.string().optional(),
	introduction: z.string().min(1),
});

export type ApplicationValues = z.infer<typeof createApplicationSchema>;

export interface JobOffer {
	id: string;
	position: string;
	description: string;
	level: string;
	employmentType: string;
	workType: string;
	salaryFrom: number;
	salaryTo: number;
	salaryCurrency: string;
	createdAt: string;
}

export interface SkillItem {
	id: string;
	name: string;
}

export interface JobOfferDetailed extends JobOffer {
	company: Company;
	jobOfferSkills: {
		skill: SkillItem;
	}[];
	jobOfferTechnologies: { technology: SkillItem }[];
}

export const jobOffersApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getJobOffer: builder.query<{ jobOffer: JobOfferDetailed }, string>({
			query: (id) => `job-offers/${id}`,
			providesTags: ['JobOffer'],
		}),
		getJobOffers: builder.query<{ jobOffers: JobOffer[] }, void>({
			query: () => `job-offers`,
			providesTags: ['JobOffer'],
		}),
		updateJobOffer: builder.mutation<JobOffer, JobOffer>({
			query: (data) => {
				const { id, ...body } = data;
				return {
					url: `job-offers/${id}`,
					method: 'PUT',
					body,
				};
			},
			async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
				const result = dispatch(
					jobOffersApi.util.updateQueryData('getJobOffer', id, (draft) => {
						Object.assign(draft.jobOffer, patch);
					})
				);
				try {
					await queryFulfilled;
				} catch {
					result.undo();
				}
			},
		}),
		deleteJobOffer: builder.mutation<void, string>({
			query: (id) => ({
				url: `job-offers/${id}`,
				method: 'DELETE',
			}),
		}),
		createApplication: builder.mutation<
			void,
			ApplicationValues & { id: string }
		>({
			query: (data) => {
				const { id, ...body } = data;
				return {
					url: `job-offers/${id}/applications`,
					method: 'POST',
					body,
				};
			},
		}),
	}),
});

export const {
	useGetJobOffersQuery,
	useLazyGetJobOfferQuery,
	useCreateApplicationMutation,
} = jobOffersApi;
