import { api } from './api';
import { SkillItem } from './jobOffers';

export const technologiesApi = api.injectEndpoints({
	endpoints: (build) => ({
		getTechnologies: build.query<{ technologies: SkillItem[] }, void>({
			query: () => 'technologies',
		}),
	}),
});

export const { useGetTechnologiesQuery } = technologiesApi;
