import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface NavigationLinkProps {
	to: string;
	active: boolean;
	children: ReactNode;
}

const NavigationLink = ({ to, active, children }: NavigationLinkProps) => {
	return (
		<Link
			to={to}
			className={cn(
				'inline-flex items-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 justify-start',
				{
					'bg-primary text-primary-foreground hover:text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3 dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white justify-start':
						active,
				}
			)}
		>
			{children}
		</Link>
	);
};

export default NavigationLink;
