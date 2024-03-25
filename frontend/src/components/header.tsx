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
import { Code, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Link } from 'react-router-dom';

const Header = () => {
	const { user } = useAppSelector((state) => state.auth);
	const { setTheme } = useTheme();

	return (
		<header className="p-2 border-b flex justify-between items-center sticky top-0 bg-background z-10">
			<div className="flex items-center gap-4">
				<Link to="/" className="inline-flex items-center gap-1 font-medium">
					<Code className="w-6 h-6" />
					CodeCareers
				</Link>
				<Link to="/">
					<Button variant="link">Home</Button>
				</Link>
			</div>
			<div className="flex items-center gap-4">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="icon">
							<SunIcon className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
							<MoonIcon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
							<span className="sr-only">Toggle theme</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => setTheme('light')}>
							Light
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setTheme('dark')}>
							Dark
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setTheme('system')}>
							System
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<div className="flex gap-2">
					{user ? (
						<DropdownMenu>
							<DropdownMenuTrigger className="outline-none">
								<Avatar className="w-9 h-9">
									{user.avatar && (
										<AvatarImage src={user.avatar} alt="avatar" />
									)}
									<AvatarFallback>
										{user.username?.substring(0, 2)}
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
										Applications
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
			</div>
		</header>
	);
};

export default Header;
