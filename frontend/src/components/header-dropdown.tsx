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
import {
	Building2,
	FilePen,
	LogOut,
	Settings,
	UserIcon,
	Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HeaderDropdown = ({ user }: { user: User }) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="outline-none">
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
				<Link to="/my-applications">
					<DropdownMenuItem className="cursor-pointer">
						<FilePen size={16} className="mr-2" />
						Applications
					</DropdownMenuItem>
				</Link>
				<Link to="/my-recruitments">
					<DropdownMenuItem className="cursor-pointer">
						<Users size={16} className="mr-2" />
						Recruitments
					</DropdownMenuItem>
				</Link>
				<Link to="/my-companies">
					<DropdownMenuItem className="cursor-pointer">
						<Building2 size={16} className="mr-2" />
						Companies
					</DropdownMenuItem>
				</Link>
				<Link to="/settings">
					<DropdownMenuItem className="cursor-pointer">
						<Settings size={16} className="mr-2" />
						Settings
					</DropdownMenuItem>
				</Link>
				<a href={`${import.meta.env.VITE_API_URI}/logout`}>
					<DropdownMenuItem className="cursor-pointer">
						<LogOut size={16} className="mr-2" />
						Logout
					</DropdownMenuItem>
				</a>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default HeaderDropdown;
