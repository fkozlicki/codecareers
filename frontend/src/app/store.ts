import auth from '@/app/authSlice';
import { api } from '@/app/services/api';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

const rootReducer = combineReducers({
	[api.reducerPath]: api.reducer,
	auth,
});

export const setupStore = (preloadedState?: Partial<RootState>) => {
	return configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(api.middleware),
		preloadedState,
	});
};

export const store = setupStore();

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof setupStore>;
