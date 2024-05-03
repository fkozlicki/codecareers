import {
	useGetMessagesQuery,
	useLazyGetMessagesQuery,
} from '@/app/services/chats';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Message from './message';
import Empty from './ui/empty';
import MessagesSkeleton from './messages-skeleton';

interface ChatMessagesProps {
	id: string;
}

const ChatMessages = ({ id }: ChatMessagesProps) => {
	const { data, isLoading, isUninitialized, isError, isFetching } =
		useGetMessagesQuery({
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
		return <MessagesSkeleton />;
	}

	if (isError) {
		return <div>Couldn't load data</div>;
	}

	return (
		<div className="flex flex-col-reverse gap-2 overflow-y-auto pr-4 flex-1">
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
			{isFetching && <MessagesSkeleton />}
			<div ref={ref}></div>
			{!data.hasNextPage && (
				<div className="flex-1 grid place-items-center py-3">
					<Empty message="No more messages" />
				</div>
			)}
		</div>
	);
};

export default ChatMessages;
