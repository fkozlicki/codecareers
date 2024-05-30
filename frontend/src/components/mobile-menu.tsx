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

const MobileMenu = () => {
	return (
		<div className="sm:hidden">
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="ghost" size="icon">
						<MenuIcon size={16} />
					</Button>
				</SheetTrigger>
				<SheetContent className="w-full">
					<SheetHeader>
						<SheetTitle className="my-4">
							<Link
								to="/"
								className="inline-flex items-center gap-1 font-medium"
							>
								<CodeIcon className="w-6 h-6" />
								CodeCareers
							</Link>
						</SheetTitle>
					</SheetHeader>
					<div className="flex flex-col gap-2">
						<Link to="/">
							<Button variant="outline" className="w-full">
								Home
							</Button>
						</Link>
						<Link to="/signin">
							<Button className="w-full text-start">Sign In</Button>
						</Link>
						<Link to="/signup">
							<Button className="w-full text-start">Sign Up</Button>
						</Link>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
};

export default MobileMenu;
