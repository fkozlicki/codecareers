import { useLazyGetApplicationsQuery } from '@/app/services/applications';
import JobOfferCard from '@/components/job-offer-card';
import JobOfferSkeleton from '@/components/job-offer-skeleton';
import Empty from '@/components/ui/empty';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const Applications = () => {
	const [fetchApplications, { data, isLoading, isFetching }] =
		useLazyGetApplicationsQuery();
	const [searchParams] = useSearchParams();
	const sort = searchParams.get('sort');

	useEffect(() => {
		fetchApplications(sort);
	}, [sort]);

	if (isLoading || isFetching) {
		return (
			<div className="flex flex-col gap-4">
				<JobOfferSkeleton />
				<JobOfferSkeleton />
				<JobOfferSkeleton />
			</div>
		);
	}

	if (data && data.applications.length === 0) {
		return (
			<div>
				<Empty
					message={`You have no ${
						sort?.toLowerCase() ?? 'pending'
					} applications`}
				/>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			{data?.applications.map((application) => (
				<JobOfferCard key={application.id} jobOffer={application.jobOffer} />
			))}
		</div>
	);
};

export default Applications;
