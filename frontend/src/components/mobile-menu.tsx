import { CodeIcon, MenuIcon } from 'lucide-react';
import { Button } from './ui/button';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from './ui/sheet';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { navigationLinks } from '@/data/links';

const MobileMenu = () => {
	const { user } = useAppSelector((state) => state.auth);

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" data-testid="mobile-menu-btn">
					<MenuIcon size={16} />
					<span className="sr-only">Open menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent className="w-full">
				<SheetHeader>
					<SheetTitle className="my-4">
						<Link to="/" className="inline-flex items-center gap-1 font-medium">
							<CodeIcon className="w-6 h-6" />
							CodeCareers
						</Link>
					</SheetTitle>
				</SheetHeader>
				<>
					<Link to="/">
						<Button variant="outline" className="w-full mb-6">
							Home
						</Button>
					</Link>
					{user ? (
						<>
							<p className="text-muted-foreground mb-2" data-testid="username">
								{user.username || `${user.firstName} ${user.lastName}`}
							</p>
							<div className="grid gap-2">
								{navigationLinks.map(({ href, Icon, label }, index) => (
									<Link to={href} key={index} className="ml-4">
										<Button variant="outline" className="justify-start w-full">
											<Icon size={16} className="mr-2" />
											{label}
										</Button>
									</Link>
								))}
							</div>
						</>
					) : (
						<>
							<Link to="/signin">
								<Button className="w-full text-start">Sign In</Button>
							</Link>
							<Link to="/signup">
								<Button className="w-full text-start">Sign Up</Button>
							</Link>
						</>
					)}
				</>
			</SheetContent>
		</Sheet>
	);
};

export default MobileMenu;
