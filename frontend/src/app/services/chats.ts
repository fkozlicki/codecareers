import { socket } from '@/lib/socket';
import { api } from './api';
import { User } from './auth';

interface Message {
	id: string;
	content: string;
	createdAt: string;
	user: User;
}

export const chatsApi = api.injectEndpoints({
	endpoints: (build) => ({
		getMessages: build.query<
			{ messages: Message[]; hasNextPage: boolean; cursor?: string },
			{ id: string; pageSize: number; cursor?: string }
		>({
			query: ({ id, pageSize, cursor }) =>
				`chats/${id}/messages?pageSize=${pageSize}${
					cursor ? `&cursor=${cursor}` : ''
				}`,
			serializeQueryArgs: ({ endpointName }) => {
				return endpointName;
			},
			merge: (currentCache, newItems, { arg: { cursor } }) => {
				if (!cursor && currentCache.messages.length > 0) {
					currentCache.messages = [];
				}
				currentCache.messages.push(...newItems.messages);
				currentCache.cursor = newItems.cursor;
				currentCache.hasNextPage = newItems.hasNextPage;
			},
			forceRefetch({ currentArg, previousArg }) {
				return currentArg !== previousArg;
			},
			async onCacheEntryAdded(
				arg,
				{ cacheDataLoaded, cacheEntryRemoved, updateCachedData }
			) {
				try {
					await cacheDataLoaded;

					const listener = (message: Message) => {
						updateCachedData((draft) => {
							draft.messages.unshift(message);
						});
					};

					socket.on('message', listener);
				} catch (error) {
					console.error(error);
				}

				await cacheEntryRemoved;
			},
		}),
		createMessage: build.mutation<Message, { id: string; content: string }>({
			query: ({ id, content }) => ({
				url: `chats/${id}/messages`,
				method: 'POST',
				body: { content },
			}),
		}),
	}),
});

export const {
	useGetMessagesQuery,
	useCreateMessageMutation,
	useLazyGetMessagesQuery,
} = chatsApi;
