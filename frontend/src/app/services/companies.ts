import { api } from './api';

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
		}),
		getCompany: builder.query<{ company: Company }, string>({
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
		deleteCompany: builder.mutation<void, string>({
			query: (id) => ({
				url: `companies/${id}`,
				method: 'DELETE',
			}),
		}),
	}),
});

export const {
	useGetCompaniesQuery,
	useCreateCompanyMutation,
	useGetCompanyQuery,
} = companiesApi;
