import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
	baseUrl: import.meta.env.VITE_API_URI ?? 'http://localhost:3000',
	credentials: 'include',
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 3 });

export const api = createApi({
	reducerPath: 'splitApi',
	baseQuery: baseQueryWithRetry,
	endpoints: () => ({}),
	tagTypes: [
		'Companies',
		'JobOffers',
		'Applications',
		'Recruitments',
		'Messages',
		'Skills',
		'Technologies',
		'Users',
	],
});
