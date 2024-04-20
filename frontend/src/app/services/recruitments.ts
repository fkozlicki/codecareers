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
			providesTags: (result = { recruitments: [] }) => [
				...result.recruitments.map(
					({ id }) => ({ type: 'Recruitments', id } as const)
				),
				{ type: 'Recruitments', id: 'LIST' },
			],
		}),
		getRecruitment: build.query<{ recruitment: RecruitmentDetails }, string>({
			query: (id) => `recruitments/${id}`,
			providesTags: (_result, _err, id) => [{ type: 'Recruitments', id }],
		}),
	}),
});

export const { useGetRecruitmentsQuery, useGetRecruitmentQuery } =
	recruitmentsApi;
