import Header from '@/components/header';
import { Toaster } from '@/components/ui/sonner';
import { Outlet } from 'react-router-dom';

const Layout = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<Toaster />
			<Header />
			<main className="flex-1">
				<Outlet />
			</main>
		</div>
	);
};

export default Layout;
