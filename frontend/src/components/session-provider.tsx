import { useSessionQuery } from '@/app/services/auth';
import { ReactNode } from 'react';

const SessionProvider = ({ children }: { children: ReactNode }) => {
	useSessionQuery();

	return children;
};

export default SessionProvider;
