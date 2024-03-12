import {
	useGetJobOfferQuery,
	useLazyGetJobOfferApplicationsQuery,
	useUpdateJobOfferMutation,
} from '@/app/services/jobOffers';
import ApplicationCard from '@/components/application-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const CompanyJobOffer = () => {
	const { id, jobOfferId } = useParams();
	const { data } = useGetJobOfferQuery(jobOfferId!);
	const [updateJobOffer] = useUpdateJobOfferMutation();
	const [searchParams] = useSearchParams();
	const sort = searchParams.get('sort');
	const [fetchApplications, { data: applications }] =
		useLazyGetJobOfferApplicationsQuery();

	useEffect(() => {
		if (!jobOfferId) {
			return;
		}
		fetchApplications({ id: jobOfferId, sort: sort });
	}, [sort, jobOfferId]);

	const handleChangePublic = () => {
		if (!jobOfferId) {
			return;
		}

		updateJobOffer({
			id: jobOfferId,
			published: !published,
		})
			.unwrap()
			.then(() => {
				toast.success('Published successfully');
			});
	};

	if (!data) {
		return null;
	}

	const { position, published } = data.jobOffer;

	return (
		<div>
			<div className="flex justify-between items-center mb-8">
				<div className="flex items-center gap-4">
					<h2 className="text-3xl font-semibold tracking-tight">{position}</h2>
					<Badge
						variant="outline"
						className={cn({
							'border-green-300 text-green-600': published,
							'border-blue-300 text-blue-600': !published,
						})}
					>
						{published ? 'Public' : 'Draft'}
					</Badge>
				</div>
				<div className="flex gap-2">
					<Link to={`/my-companies/${id}/job-offers/${jobOfferId}/edit`}>
						<Button>Edit</Button>
					</Link>
					<Button onClick={handleChangePublic}>
						{published ? 'Unpublish' : 'Publish'}
					</Button>
				</div>
			</div>
			<Tabs
				value={sort ?? 'new'}
				defaultValue="new"
				className="flex justify-center mb-8"
			>
				<TabsList>
					<Link to={`/my-companies/${id}/job-offers/${jobOfferId}`}>
						<TabsTrigger value="new">New</TabsTrigger>
					</Link>
					<Link
						to={`/my-companies/${id}/job-offers/${jobOfferId}?sort=accepted`}
					>
						<TabsTrigger value="accepted">Accepted</TabsTrigger>
					</Link>
					<Link
						to={`/my-companies/${id}/job-offers/${jobOfferId}?sort=appointed`}
					>
						<TabsTrigger value="appointed">Appointed</TabsTrigger>
					</Link>
					<Link
						to={`/my-companies/${id}/job-offers/${jobOfferId}?sort=rejected`}
					>
						<TabsTrigger value="rejected">Rejected</TabsTrigger>
					</Link>
				</TabsList>
			</Tabs>
			<div className="flex flex-col gap-4">
				{applications?.applications.map((application) => (
					<ApplicationCard key={application.id} application={application} />
				))}
			</div>
		</div>
	);
};

export default CompanyJobOffer;
