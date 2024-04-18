import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, useParams, useSearchParams } from 'react-router-dom';

const JobOfferTabs = () => {
	const { companyId, jobOfferId } = useParams();
	const [searchParams] = useSearchParams();
	const sort = searchParams.get('sort');

	return (
		<Tabs
			value={sort ?? 'new'}
			defaultValue="new"
			className="flex justify-center mb-8"
		>
			<TabsList>
				<Link to={`/my-companies/${companyId}/job-offers/${jobOfferId}`}>
					<TabsTrigger value="new">New</TabsTrigger>
				</Link>
				<Link
					to={`/my-companies/${companyId}/job-offers/${jobOfferId}?sort=accepted`}
				>
					<TabsTrigger value="accepted">Accepted</TabsTrigger>
				</Link>
				<Link
					to={`/my-companies/${companyId}/job-offers/${jobOfferId}?sort=rejected`}
				>
					<TabsTrigger value="rejected">Rejected</TabsTrigger>
				</Link>
			</TabsList>
		</Tabs>
	);
};

export default JobOfferTabs;
