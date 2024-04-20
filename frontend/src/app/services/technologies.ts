import { api } from './api';
import { SkillItem } from './jobOffers';

export const technologiesApi = api.injectEndpoints({
	endpoints: (build) => ({
		getTechnologies: build.query<{ technologies: SkillItem[] }, void>({
			query: () => 'technologies',
			providesTags: (result = { technologies: [] }) => [
				...result.technologies.map(
					({ id }) => ({ type: 'Technologies', id } as const)
				),
				{ type: 'Technologies', id: 'LIST' },
			],
		}),
	}),
});

export const { useGetTechnologiesQuery } = technologiesApi;
