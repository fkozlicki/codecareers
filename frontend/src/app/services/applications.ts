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
			providesTags: (result = { applications: [] }) => [
				...result.applications.map(
					({ id }) => ({ type: 'Applications', id } as const)
				),
				{ type: 'Applications' as const, id: 'LIST' },
			],
		}),
		acceptApplication: build.mutation<{ application: Application }, string>({
			query: (id) => {
				return { url: `applications/${id}/accept`, method: 'POST' };
			},
			invalidatesTags: (result) => [
				{ type: 'Applications', id: result?.application.id },
			],
		}),
		rejectApplication: build.mutation<{ application: Application }, string>({
			query: (id) => {
				return { url: `applications/${id}/reject`, method: 'POST' };
			},
			invalidatesTags: (result) => [
				{ type: 'Applications', id: result?.application.id },
			],
		}),
	}),
});

export const {
	useGetApplicationsQuery,
	useAcceptApplicationMutation,
	useRejectApplicationMutation,
} = applicationsApi;
