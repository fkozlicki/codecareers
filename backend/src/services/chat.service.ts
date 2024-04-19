import { db } from '../db';
import { chatUsers, chats } from '../db/schema';

export const createChat = async (userId: string, ownerId: string) => {
	const [newChat] = await db.insert(chats).values({}).returning();

	await db.insert(chatUsers).values({ chatId: newChat.id, userId });

	if (ownerId !== userId) {
		await db.insert(chatUsers).values({
			chatId: newChat.id,
			userId: ownerId,
		});
	}

	return newChat;
};
