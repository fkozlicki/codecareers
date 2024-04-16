import { useAppSelector } from '@/app/hooks';
import {
	useGetMessagesQuery,
	useLazyGetMessagesQuery,
} from '@/app/services/chats';
import { User } from 'lucide-react';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

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
			{data.messages.map(({ id, content, user }, index, array) =>
				user.id === session.user?.id ? (
					<div
						key={id}
						className="self-end p-2 bg-primary text-primary-foreground rounded-md text-sm"
					>
						{content}
					</div>
				) : (
					<div key={id} className="flex items-center gap-2">
						{index + 1 !== array.length &&
						array[index + 1].user.id === user.id ? (
							<div className="w-[36px]"></div>
						) : (
							<Avatar className="w-[36px] h-[36px]">
								<AvatarFallback>
									<User />
								</AvatarFallback>
								<AvatarImage src={user.avatar ?? undefined} alt="user avatar" />
							</Avatar>
						)}

						<div className="p-2 text-sm bg-secondary rounded-md">{content}</div>
					</div>
				)
			)}
			<div ref={ref}></div>
		</div>
	);
};

export default ChatMessages;
