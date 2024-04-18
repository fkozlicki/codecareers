import { socket } from '@/lib/socket';
import { useEffect } from 'react';
import ChatForm from './chat-form';
import ChatMessages from './chat-messages';

const RecruitmentChat = ({ id }: { id: string }) => {
	useEffect(() => {
		socket.connect();

		socket.emit('join_room', `chat-${id}`);

		return () => {
			socket.disconnect();
		};
	}, []);

	return (
		<div className="h-full flex flex-col gap-4">
			<ChatMessages id={id} />
			<ChatForm id={id} />
		</div>
	);
};

export default RecruitmentChat;
