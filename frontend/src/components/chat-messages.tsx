import { useAppSelector } from '@/app/hooks';
import {
	useGetMessagesQuery,
	useLazyGetMessagesQuery,
} from '@/app/services/chats';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface ChatMessagesProps {
	id: string;
}

const ChatMessages = ({ id }: ChatMessagesProps) => {
	const { data, isLoading, isUninitialized, isError } = useGetMessagesQuery({
		id,
		pageSize: 10,
	});
	const [fetchMore] = useLazyGetMessagesQuery();
	const session = useAppSelector((state) => state.auth);
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
			{data.messages.map(({ id, content, user }) => (
				<div
					key={id}
					className={cn('bg-secondary self-start p-2 rounded-md text-sm', {
						'self-end bg-primary text-primary-foreground':
							user.id === session.user?.id,
					})}
				>
					{content}
				</div>
			))}
			<div ref={ref}></div>
		</div>
	);
};

export default ChatMessages;
