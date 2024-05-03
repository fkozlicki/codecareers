import { useAppSelector } from '@/app/hooks';
import { RecruitmentDetails } from '@/app/services/recruitments';
import { socket } from '@/lib/socket';
import { useEffect } from 'react';
import ChatForm from './chat-form';
import ChatMessages from './chat-messages';
import ChatUser from './chat-user';

const RecruitmentChat = ({ chat }: { chat: RecruitmentDetails['chat'] }) => {
	const { user } = useAppSelector((state) => state.auth);

	useEffect(() => {
		socket.connect();

		socket.emit('join_room', `chat-${chat.id}`);

		return () => {
			socket.disconnect();
		};
	}, []);

	const { id, chatUsers } = chat;
	const chatUser = chatUsers.find(
		(chatUser) => chatUser.user.id !== user?.id
	)?.user;

	return (
		<div className="h-full flex flex-col">
			{chatUser && <ChatUser user={chatUser} />}
			<ChatMessages id={id} />
			<ChatForm id={id} />
		</div>
	);
};

export default RecruitmentChat;
