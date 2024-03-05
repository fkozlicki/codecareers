import { User, session } from '@/app/services/auth';
import { createSlice } from '@reduxjs/toolkit';

interface AuthState {
	user: User | null;
	status: 'loading' | 'authenticated' | 'unauthenticated';
}

const initialState: AuthState = {
	user: null,
	status: 'loading',
};

const { reducer, actions } = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: () => initialState,
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(session.matchPending, (state) => {
				state.status = 'loading';
			})
			.addMatcher(session.matchFulfilled, (state, action) => {
				if (action.payload.user) {
					state.status = 'authenticated';
					state.user = action.payload.user;
				} else {
					state.status = 'unauthenticated';
				}
			});
	},
});

export const { logout } = actions;

export default reducer;
