import { api } from './api';
import { SkillItem } from './jobOffers';

export const skillsApi = api.injectEndpoints({
	endpoints: (build) => ({
		getSkills: build.query<{ skills: SkillItem[] }, void>({
			query: () => 'skills',
			providesTags: (result = { skills: [] }) => [
				...result.skills.map(({ id }) => ({ type: 'Skills', id } as const)),
				{ type: 'Skills', id: 'LIST' },
			],
		}),
	}),
});

export const { useGetSkillsQuery } = skillsApi;
