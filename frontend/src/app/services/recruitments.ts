import { api } from './api';
import { Application } from './applications';
import { User } from './auth';
import { Recruitment } from './companies';
import { JobOfferDetailed } from './jobOffers';

export interface RecruitmentDetails {
	id: string;
	application: Application & {
		jobOffer: JobOfferDetailed;
	};
	createdAt: string;
	open: boolean;
	chat: {
		id: string;
		chatUsers: {
			user: User;
		}[];
	};
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
