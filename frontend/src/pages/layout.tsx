import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
	return (
		<>
			<Toaster />
			<div className="p-2 border border-b flex justify-between items-center">
				<div>logo</div>
				<div className="flex gap-2">
					<Link to="/signin">
						<Button>Sign In</Button>
					</Link>
					<Link to="/signup">
						<Button>Sign Up</Button>
					</Link>
				</div>
			</div>
			<main>
				<div className="max-w-lg m-auto">
					<Outlet />
				</div>
			</main>
		</>
	);
};

export default Layout;
