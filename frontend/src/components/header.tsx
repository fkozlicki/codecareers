import { useAppSelector } from '@/app/hooks';
import { Button } from '@/components/ui/button';
import { Code } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeaderDropdown from './header-dropdown';
import ThemeDropdown from './theme-dropdown';

const Header = () => {
	const { user } = useAppSelector((state) => state.auth);

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
				<ThemeDropdown />
				<div className="flex gap-2">
					{user ? (
						<HeaderDropdown user={user} />
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
