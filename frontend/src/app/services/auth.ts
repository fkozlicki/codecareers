import { api } from './api';

export interface User {
	firstName?: string;
	lastName?: string;
	username?: string;
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
		signUp: builder.mutation<null, SignUpCredentials>({
			query: (credentials) => ({
				url: 'signup',
				method: 'POST',
				body: credentials,
			}),
		}),
		signIn: builder.mutation<null, SignInCredentials>({
			query: (credentials) => ({
				url: 'signin',
				method: 'POST',
				body: credentials,
			}),
		}),
		session: builder.query<{ user: User }, void>({
			query: () => 'session',
		}),
	}),
});

export const { useSignInMutation, useSignUpMutation, useSessionQuery } =
	authApi;

export const { signIn, signUp, session } = authApi.endpoints;
