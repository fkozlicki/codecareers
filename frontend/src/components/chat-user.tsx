import { UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User } from '@/app/services/auth';

interface ChatUserProps {
	user: User;
}

const ChatUser = ({ user }: ChatUserProps) => {
	const { avatar, username, firstName, lastName } = user;

	return (
		<div className="flex items-center gap-2 pb-2 border-b">
			<Avatar>
				<AvatarFallback>
					<UserIcon size={16} />
				</AvatarFallback>
				<AvatarImage src={avatar ?? undefined} alt="user avatar" />
			</Avatar>
			<span>{username || `${firstName} ${lastName}`}</span>
		</div>
	);
};

export default ChatUser;
