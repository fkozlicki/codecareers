import { useAppSelector } from '@/app/hooks';
import { UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User } from '@/app/services/auth';

interface MessageProps {
	content: string;
	leading: boolean;
	user: User;
}

const Message = ({ user, content, leading }: MessageProps) => {
	const session = useAppSelector((state) => state.auth);

	return user.id === session.user?.id ? (
		<div className="self-end p-2 bg-primary text-primary-foreground rounded-md text-sm">
			{content}
		</div>
	) : (
		<div className="flex items-center gap-2">
			{leading ? (
				<Avatar className="w-9 h-9">
					<AvatarFallback>
						<UserIcon />
					</AvatarFallback>
					<AvatarImage src={user.avatar ?? undefined} alt="user avatar" />
				</Avatar>
			) : (
				<div className="w-9"></div>
			)}

			<div className="p-2 text-sm bg-secondary rounded-md">{content}</div>
		</div>
	);
};

export default Message;
