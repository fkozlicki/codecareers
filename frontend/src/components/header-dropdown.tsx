import { User } from '@/app/services/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { navigationLinks } from '@/data/links';
import { UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeaderDropdown = ({ user }: { user: User }) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className="outline-none"
				data-testid="user-dropdown-btn"
			>
				<Avatar className="w-9 h-9">
					{user.avatar && <AvatarImage src={user.avatar} alt="avatar" />}
					<AvatarFallback>
						<UserIcon size={16} className="text-muted-foreground" />
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>
					{user.username || `${user.firstName} ${user.lastName}`}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{navigationLinks.map(({ href, Icon, label }, index) => (
					<Link to={href} key={index}>
						<DropdownMenuItem className="cursor-pointer">
							<Icon size={16} className="mr-2" />
							{label}
						</DropdownMenuItem>
					</Link>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default HeaderDropdown;
