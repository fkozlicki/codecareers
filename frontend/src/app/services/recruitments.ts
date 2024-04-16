import { api } from './api';
import { Application } from './applications';
import { User } from './auth';

interface RecruitmentDetails {
	id: string;
	application: Application;
}

interface Message {
	id: string;
	content: string;
	createdAt: string;
	user: User;
}

export const recruitmentsApi = api.injectEndpoints({
	endpoints: (build) => ({
		getRecruitment: build.query<{ recruitment: RecruitmentDetails }, string>({
			query: (id) => `recruitments/${id}`,
			providesTags: ['Recruitment'],
		}),
		getMessages: build.query<
			{ messages: Message[]; hasNextPage: boolean; cursor?: string },
			{ id: string; pageSize: number; cursor?: string }
		>({
			query: ({ id, pageSize, cursor }) =>
				`recruitments/${id}/chat/messages?pageSize=${pageSize}${
					cursor ? `?cursor=${cursor}` : ''
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
		}),
	}),
});

export const { useGetRecruitmentQuery, useGetMessagesQuery } = recruitmentsApi;
