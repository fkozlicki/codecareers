import { z } from 'zod';

export const createMessageSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
	body: z.object({
		content: z.string(),
	}),
});

export type CreateMessageSchema = z.infer<typeof createMessageSchema>;

export const getMessagesSchema = z.object({
	params: z.object({
		id: z.string(),
	}),
	query: z.object({
		pageSize: z.string().optional(),
		cursor: z.string().optional(),
	}),
});

export type GetMessagesSchema = z.infer<typeof getMessagesSchema>;
