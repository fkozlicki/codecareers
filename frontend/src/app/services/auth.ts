import { api } from './api';

export interface User {
	id: string;
	firstName?: string;
	lastName?: string;
	username?: string;
	avatar: string | null;
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
		signUp: builder.mutation<void, SignUpCredentials>({
			query: (credentials) => ({
				url: 'signup',
				method: 'POST',
				body: credentials,
			}),
		}),
		signIn: builder.mutation<{ user: User }, SignInCredentials>({
			query: (credentials) => ({
				url: 'login/credentials',
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
