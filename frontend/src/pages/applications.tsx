import { useGetApplicationsQuery } from '@/app/services/applications';
import JobOfferCard from '@/components/job-offer-card';

const Applications = () => {
	const { data } = useGetApplicationsQuery();

	return (
		<div>
			{data?.applications.map((application) => (
				<JobOfferCard key={application.id} jobOffer={application.jobOffer} />
			))}
		</div>
	);
};

export default Applications;
