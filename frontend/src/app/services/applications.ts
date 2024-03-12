import { api } from './api';
import { User } from './auth';
import { JobOffer } from './jobOffers';

export interface Application {
	id: string;
	cv?: string;
	introduction: string;
	jobOffer: JobOffer;
	user: User;
}

export const applicationsApi = api.injectEndpoints({
	endpoints: (build) => ({
		getApplications: build.query<{ applications: Application[] }, void>({
			query: () => 'applications',
		}),
	}),
});

export const { useGetApplicationsQuery } = applicationsApi;
