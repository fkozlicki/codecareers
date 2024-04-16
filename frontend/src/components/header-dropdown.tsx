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
import { Link } from 'react-router-dom';

const HeaderDropdown = ({ user }: { user: User }) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="outline-none">
				<Avatar className="w-9 h-9">
					{user.avatar && <AvatarImage src={user.avatar} alt="avatar" />}
					<AvatarFallback>{user.username?.substring(0, 2)}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>
					{user.username || `${user.firstName} ${user.lastName}`}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<Link to="/my-applications">
					<DropdownMenuItem className="cursor-pointer">
						Applications
					</DropdownMenuItem>
				</Link>
				<Link to="/my-recruitments">
					<DropdownMenuItem className="cursor-pointer">
						Recruitments
					</DropdownMenuItem>
				</Link>
				<Link to="/my-companies">
					<DropdownMenuItem className="cursor-pointer">
						Companies
					</DropdownMenuItem>
				</Link>
				<Link to="/settings">
					<DropdownMenuItem className="cursor-pointer">
						Settings
					</DropdownMenuItem>
				</Link>
				<a href="http://localhost:3000/logout">
					<DropdownMenuItem className="cursor-pointer">Logout</DropdownMenuItem>
				</a>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default HeaderDropdown;
