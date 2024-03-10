import { api } from './api';
import { JobOffer } from './jobOffers';

interface Application {
	id: string;
	cv?: string;
	introduction: string;
	jobOffer: JobOffer;
}

export const applicationsApi = api.injectEndpoints({
	endpoints: (build) => ({
		getApplications: build.query<{ applications: Application[] }, void>({
			query: () => 'applications',
		}),
	}),
});

export const { useGetApplicationsQuery } = applicationsApi;
