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
			providesTags: (_result, _err, id) => [{ type: 'JobOffers', id }],
		}),
		getJobOffers: builder.query<
			{ jobOffers: JobOffer[]; cursor?: string; hasNextPage: boolean },
			{ pageSize: number; cursor?: string; position: string | null }
		>({
			query: ({ position, pageSize, cursor }) => {
				return `job-offers?pageSize=${pageSize}${
					cursor ? `&cursor=${cursor}` : ''
				}${position ? `&position=${position}` : ''}`;
			},
			providesTags: (result = { jobOffers: [], hasNextPage: false }) => [
				...result.jobOffers.map(
					({ id }) => ({ type: 'JobOffers', id } as const)
				),
				{ type: 'JobOffers', id: 'LIST' },
			],
			serializeQueryArgs: ({ endpointName }) => {
				return endpointName;
			},
			// Always merge incoming data to the cache entry
			merge: (currentCache, newItems, { arg: { cursor } }) => {
				if (!cursor && currentCache.jobOffers.length > 0) {
					currentCache.jobOffers = [];
				}
				currentCache.jobOffers.push(...newItems.jobOffers);
				currentCache.cursor = newItems.cursor;
				currentCache.hasNextPage = newItems.hasNextPage;
			},
			// Refetch when the page arg changes
			forceRefetch({ currentArg, previousArg }) {
				return currentArg !== previousArg;
			},
		}),
		updateJobOffer: builder.mutation<
			{ jobOffer: JobOffer },
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
			invalidatesTags: (result) => [
				{ type: 'JobOffers', id: result?.jobOffer.id },
			],
		}),
		deleteJobOffer: builder.mutation<{ jobOffer: JobOffer }, string>({
			query: (id) => ({
				url: `job-offers/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result) => [
				{ type: 'JobOffers', id: result?.jobOffer.id },
			],
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
			invalidatesTags: [{ type: 'Applications', id: 'LIST' }],
		}),
		getJobOfferApplications: builder.query<
			{ applications: Application[] },
			{ id: string; sort: string | null }
		>({
			query: ({ id, sort }) => ({
				url: `job-offers/${id}/applications${sort ? `?sort=${sort}` : ''}`,
			}),
			providesTags: (result = { applications: [] }) => [
				...result.applications.map(
					({ id }) => ({ type: 'Applications', id } as const)
				),
				{ type: 'Applications', id: 'LIST' },
			],
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
	useGetJobOfferApplicationsQuery,
	useDeleteJobOfferMutation,
} = jobOffersApi;
