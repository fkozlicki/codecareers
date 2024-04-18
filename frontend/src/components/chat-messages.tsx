import {
	useGetMessagesQuery,
	useLazyGetMessagesQuery,
} from '@/app/services/chats';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Message from './message';

interface ChatMessagesProps {
	id: string;
}

const ChatMessages = ({ id }: ChatMessagesProps) => {
	const { data, isLoading, isUninitialized, isError } = useGetMessagesQuery({
		id,
		pageSize: 10,
	});
	const [fetchMore] = useLazyGetMessagesQuery();
	const [ref, inView] = useInView();

	useEffect(() => {
		if (inView && !isLoading && data?.hasNextPage) {
			fetchMore({ id, pageSize: 10, cursor: data.cursor });
		}
	}, [inView]);

	if (isLoading || isUninitialized) {
		return <div>Loading..</div>;
	}

	if (isError) {
		return <div>Couldn't load data</div>;
	}

	return (
		<div className="flex flex-col-reverse gap-2 overflow-y-auto pr-4">
			{data.messages.map(({ id, content, user }, index, array) => (
				<Message
					key={id}
					content={content}
					user={user}
					leading={
						index + 1 === array.length || array[index + 1].user.id !== user.id
					}
				/>
			))}
			<div ref={ref}></div>
		</div>
	);
};

export default ChatMessages;
