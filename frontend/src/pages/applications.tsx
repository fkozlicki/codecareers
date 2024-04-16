import ApplicationsList from '@/components/applications-list';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, useSearchParams } from 'react-router-dom';

const Applications = () => {
	const [searchParams] = useSearchParams();
	const sort = searchParams.get('sort');

	return (
		<div className="max-w-2xl m-auto py-8">
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-4xl text-center mb-4">
				Your applications
			</h1>
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
			<ApplicationsList />
		</div>
	);
};

export default Applications;
