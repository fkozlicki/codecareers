import { api } from './api';
import { JobOffer } from './jobOffers';

export interface Company {
	id: string;
	name: string;
	description: string;
	phoneNumber: string;
}

export const companiesApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getCompanies: builder.query<{ companies: Company[] }, string | undefined>({
			query: (id) => `companies${id ? `?userId=${id}` : ''}`,
			providesTags: ['Company'],
		}),
		getCompany: builder.query<{ company: Company }, string>({
			query: (id) => `companies/${id}`,
			providesTags: ['Company'],
		}),
		createCompany: builder.mutation({
			query: (data) => ({
				url: 'companies',
				method: 'POST',
				body: data,
			}),
		}),
		updateCompany: builder.mutation<Company, Company>({
			query: (data) => {
				const { id, ...body } = data;
				return {
					url: `companies/${id}`,
					method: 'PUT',
					body,
				};
			},
			async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
				const result = dispatch(
					companiesApi.util.updateQueryData('getCompany', id, (draft) => {
						Object.assign(draft.company, patch);
					})
				);
				try {
					await queryFulfilled;
				} catch {
					result.undo();
				}
			},
		}),
		deleteCompany: builder.mutation<void, string>({
			query: (id) => ({
				url: `companies/${id}`,
				method: 'DELETE',
			}),
		}),
		createJobOffer: builder.mutation({
			query: (data) => {
				const { companyId, ...body } = data;
				return {
					url: `companies/${companyId}/job-offers`,
					method: 'POST',
					body,
				};
			},
		}),
		getJobOffers: builder.query<{ jobOffers: JobOffer[] }, string>({
			query: (id) => `companies/${id}/job-offers`,
			providesTags: ['JobOffer'],
		}),
	}),
});

export const {
	useGetCompaniesQuery,
	useCreateCompanyMutation,
	useGetCompanyQuery,
	useUpdateCompanyMutation,
	useCreateJobOfferMutation,
	useGetJobOffersQuery,
} = companiesApi;
