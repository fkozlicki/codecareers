import { api } from './api';

export interface User {
	firstName: string;
	lastName: string;
	image: string | null;
}

interface SignUpCredentials {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

interface SignInCredentials {
	email: string;
	password: string;
}

export const authApi = api.injectEndpoints({
	endpoints: (builder) => ({
		signUp: builder.mutation<{ message: string }, SignUpCredentials>({
			query: (credentials) => ({
				url: 'signup',
				method: 'POST',
				body: credentials,
			}),
		}),
		signIn: builder.mutation<{ user: User }, SignInCredentials>({
			query: (credentials) => ({
				url: 'signin',
				method: 'POST',
				body: credentials,
			}),
		}),
	}),
});

export const { useSignInMutation, useSignUpMutation } = authApi;

export const { signIn, signUp } = authApi.endpoints;
