import Header from '@/components/header';
import { Toaster } from '@/components/ui/sonner';
import { Outlet } from 'react-router-dom';

const Layout = () => {
	return (
		<>
			<Toaster />
			<Header />
			<main>
				<Outlet />
			</main>
		</>
	);
};

export default Layout;
