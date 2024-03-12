import { useLazyGetApplicationsQuery } from '@/app/services/applications';
import JobOfferCard from '@/components/job-offer-card';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const Applications = () => {
	const [fetchApplications, { data }] = useLazyGetApplicationsQuery();
	const [searchParams] = useSearchParams();
	const sort = searchParams.get('sort');

	useEffect(() => {
		fetchApplications(sort);
	}, [sort]);

	return (
		<div className="flex flex-col gap-4">
			{data?.applications.map((application) => (
				<JobOfferCard key={application.id} jobOffer={application.jobOffer} />
			))}
		</div>
	);
};

export default Applications;
