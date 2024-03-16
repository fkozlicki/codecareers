import { api } from './api';

export const usersApi = api.injectEndpoints({
	endpoints: (build) => ({
		updateUser: build.mutation({
			query: (data) => {
				const { id, ...body } = data;
				const formData = new FormData();
				formData.append('firstName', body.firstName);
				formData.append('lastName', body.lastName);
				formData.append('avatar', body.avatar);

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
