import { z } from 'zod';
import { api } from './api';
import { User } from './auth';

const updateUserSchema = z.object({
	id: z.string(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	avatar: z.instanceof(Blob).optional(),
});

type UpdateUserValues = z.infer<typeof updateUserSchema>;

export const usersApi = api.injectEndpoints({
	endpoints: (build) => ({
		updateUser: build.mutation<User, UpdateUserValues>({
			query: (data) => {
				const { id, ...body } = data;
				const formData = new FormData();
				Object.entries(body).forEach(([key, value]) => {
					if (value) {
						formData.append(key, value);
					}
				});

				return {
					url: `users/${id}`,
					method: 'PUT',
					body: formData,
				};
			},
		}),
	}),
});

export const { useUpdateUserMutation } = usersApi;
