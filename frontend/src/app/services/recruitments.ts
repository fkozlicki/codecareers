import { api } from './api';
import { Application } from './applications';
import { Recruitment } from './companies';

interface RecruitmentDetails {
	id: string;
	application: Application;
	chatId: string;
}

export const recruitmentsApi = api.injectEndpoints({
	endpoints: (build) => ({
		getRecruitments: build.query<{ recruitments: Recruitment[] }, void>({
			query: () => `recruitments`,
			providesTags: ['Recruitment'],
		}),
		getRecruitment: build.query<{ recruitment: RecruitmentDetails }, string>({
			query: (id) => `recruitments/${id}`,
			providesTags: ['Recruitment'],
		}),
	}),
});

export const { useGetRecruitmentsQuery, useGetRecruitmentQuery } =
	recruitmentsApi;
