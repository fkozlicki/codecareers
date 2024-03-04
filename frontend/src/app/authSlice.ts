import { User, signIn } from '@/app/services/auth';
import { createSlice } from '@reduxjs/toolkit';

interface UserState {
	user?: User;
}

const initialState: UserState = {
	user: undefined,
};

const { reducer, actions } = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: () => initialState,
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(signIn.matchPending, (_, action) => {
				console.log('pending', action);
			})
			.addMatcher(signIn.matchFulfilled, (state, action) => {
				console.log('fulfilled', action);
				state.user = action.payload.user;
			})
			.addMatcher(signIn.matchRejected, (_, action) => {
				console.log('rejected', action);
			});
	},
});

export const { logout } = actions;

export default reducer;
