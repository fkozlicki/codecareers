import { api } from './api';
import { User } from './auth';
import { JobOffer } from './jobOffers';

export interface Application {
	id: string;
	cv?: string;
	introduction: string;
	jobOffer: JobOffer;
	user: User;
	createdAt: string;
	accepted: boolean | null;
}

export const applicationsApi = api.injectEndpoints({
	endpoints: (build) => ({
		getApplications: build.query<
			{ applications: Application[] },
			string | null
		>({
			query: (sort) => `applications${sort ? `?sort=${sort}` : ''}`,
			providesTags: ['Application'],
		}),
		updateApplication: build.mutation<
			{ application: Application },
			{ id: string; accepted: boolean }
		>({
			query: (data) => {
				const { id, ...body } = data;

				return { url: `applications/${id}`, method: 'PUT', body };
			},
			onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
				try {
					await queryFulfilled;
					dispatch(applicationsApi.util.invalidateTags(['Application']));
				} catch (e) {
					console.error(e);
				}
			},
		}),
	}),
});

export const { useLazyGetApplicationsQuery, useUpdateApplicationMutation } =
	applicationsApi;
