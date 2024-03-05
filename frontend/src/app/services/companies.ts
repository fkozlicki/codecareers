import { api } from './api';

export const companiesApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getCompanies: builder.query({
			query: () => 'companies',
		}),
		getCompany: builder.query({
			query: (id) => `companies/${id}`,
		}),
		createCompany: builder.mutation({
			query: (data) => ({
				url: 'companies',
				method: 'POST',
				body: data,
			}),
		}),
		updateCompany: builder.mutation({
			query: (data) => {
				const { id, ...body } = data;
				return {
					url: `companies/${id}`,
					method: 'PUT',
					body,
				};
			},
		}),
		deleteCompany: builder.mutation({
			query: (id) => ({
				url: `companies/${id}`,
				method: 'DELETE',
			}),
		}),
	}),
});

export const { useGetCompaniesQuery, useCreateCompanyMutation } = companiesApi;
