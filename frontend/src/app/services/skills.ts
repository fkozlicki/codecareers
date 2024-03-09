import { api } from './api';
import { SkillItem } from './jobOffers';

export const skillsApi = api.injectEndpoints({
	endpoints: (build) => ({
		getSkills: build.query<{ skills: SkillItem[] }, void>({
			query: () => 'skills',
		}),
	}),
});

export const { useGetSkillsQuery } = skillsApi;
