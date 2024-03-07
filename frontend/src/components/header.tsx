import { useAppSelector } from '@/app/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';

const Header = () => {
	const { user } = useAppSelector((state) => state.auth);

	return (
		<header className="p-2 border-b flex justify-between items-center sticky top-0 bg-background">
			<Link to="/">
				<div>logo</div>
			</Link>
			<div className="flex gap-2">
				{user ? (
					<DropdownMenu>
						<DropdownMenuTrigger className="outline-none">
							<Avatar className="w-9 h-9">
								<AvatarImage src="https://github.com/fkozlicki.png" />
								<AvatarFallback>
									{user.username?.substring(0, 2)}
								</AvatarFallback>
							</Avatar>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>{user.username}</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<Link to="/my-jobs">
								<DropdownMenuItem className="cursor-pointer">
									Jobs offers
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
								<DropdownMenuItem className="cursor-pointer">
									Logout
								</DropdownMenuItem>
							</a>
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					<>
						<Link to="/signin">
							<Button>Sign In</Button>
						</Link>
						<Link to="/signup">
							<Button>Sign Up</Button>
						</Link>
					</>
				)}
			</div>
		</header>
	);
};

export default Header;
