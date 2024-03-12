import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, Outlet, useSearchParams } from 'react-router-dom';

const ApplicationsLayout = () => {
	const [searchParams] = useSearchParams();
	const sort = searchParams.get('sort');

	return (
		<div className="max-w-2xl m-auto py-8">
			<Tabs
				value={sort ?? 'pending'}
				defaultValue="pending"
				className="flex justify-center mb-6"
			>
				<TabsList className="">
					<Link to="/my-applications">
						<TabsTrigger value="pending">Pending</TabsTrigger>
					</Link>
					<Link to={`/my-applications?sort=accepted`}>
						<TabsTrigger value="accepted">Accepted</TabsTrigger>
					</Link>
					<Link to={`/my-applications?sort=rejected`}>
						<TabsTrigger value="rejected">Rejected</TabsTrigger>
					</Link>
				</TabsList>
			</Tabs>
			<Outlet />
		</div>
	);
};

export default ApplicationsLayout;
