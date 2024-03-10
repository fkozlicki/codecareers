import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Outlet } from 'react-router-dom';

const ApplicationsLayout = () => {
	return (
		<div className="max-w-2xl m-auto py-8">
			<Tabs defaultValue="account" className="mb-4 max-w-md m-auto">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="applied">Applied</TabsTrigger>
					<TabsTrigger value="accepted">Accepted</TabsTrigger>
					<TabsTrigger value="rejected">Rejected</TabsTrigger>
					<TabsTrigger value="appointed">Appointed</TabsTrigger>
				</TabsList>
			</Tabs>
			<Outlet />
		</div>
	);
};

export default ApplicationsLayout;
