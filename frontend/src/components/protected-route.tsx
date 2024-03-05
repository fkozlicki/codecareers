import { useAppSelector } from '@/app/hooks';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
	const { status } = useAppSelector((state) => state.auth);

	if (status === 'loading') {
		return null;
	}

	if (status === 'unauthenticated') {
		return <Navigate to="/signin" />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
