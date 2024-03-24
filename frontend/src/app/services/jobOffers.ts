import { api } from './api';
import { Application } from './applications';
import { Company } from './companies';
import { z } from 'zod';

export const createApplicationSchema = z.object({
	introduction: z.string().min(1),
	cv: z.instanceof(File).optional(),
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
	published: boolean;
	company: Company;
}

export interface SkillItem {
	id: string;
	name: string;
}

export interface JobOfferDetailed extends JobOffer {
	jobOfferSkills: {
		skill: SkillItem;
	}[];
	jobOfferTechnologies: { technology: SkillItem }[];
}

export const jobOffersApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getJobOffer: builder.query<{ jobOffer: JobOfferDetailed }, string>({
			query: (id) => `job-offers/${id}`,
			providesTags: (_result, _err, id) => [{ type: 'JobOffer', id }],
		}),
		getJobOffers: builder.query<
			{ jobOffers: JobOffer[] },
			{ pageSize: number; cursor?: string }
		>({
			query: (data) =>
				`job-offers?pageSize=${data.pageSize}${
					data.cursor ? `&cursor=${data.cursor}` : ''
				}`,
			providesTags: [{ type: 'JobOffer', id: 'LIST' }],
			serializeQueryArgs: ({ endpointName }) => {
				return endpointName;
			},
			// Always merge incoming data to the cache entry
			merge: (currentCache, newItems) => {
				currentCache.jobOffers.push(...newItems.jobOffers);
			},
			// Refetch when the page arg changes
			forceRefetch({ currentArg, previousArg }) {
				return currentArg !== previousArg;
			},
		}),
		updateJobOffer: builder.mutation<
			JobOffer,
			Partial<JobOffer> & { id: string }
		>({
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
			invalidatesTags: [{ type: 'JobOffer', id: 'LIST' }],
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
				const formData = new FormData();
				formData.append('introduction', body.introduction);
				if (body.cv) {
					formData.append('cv', body.cv);
				}
				return {
					url: `job-offers/${id}/applications`,
					method: 'POST',
					body: formData,
				};
			},
			invalidatesTags: [{ type: 'Application', id: 'LIST' }],
		}),
		getJobOfferApplications: builder.query<
			{ applications: Application[] },
			{ id: string; sort: string | null }
		>({
			query: ({ id, sort }) => ({
				url: `job-offers/${id}/applications${sort ? `?sort=${sort}` : ''}`,
			}),
			providesTags: [{ type: 'Application', id: 'LIST' }],
		}),
	}),
});

export const {
	useGetJobOffersQuery,
	useLazyGetJobOffersQuery,
	useLazyGetJobOfferQuery,
	useCreateApplicationMutation,
	useGetJobOfferQuery,
	useUpdateJobOfferMutation,
	useLazyGetJobOfferApplicationsQuery,
} = jobOffersApi;
