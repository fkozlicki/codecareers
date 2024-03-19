import { Link } from 'react-router-dom';
import JobOfferCard from './job-offer-card';
import { useGetJobOffersQuery } from '@/app/services/jobOffers';
import JobOfferSkeleton from './job-offer-skeleton';

const JobOfferList = () => {
	const { data, isLoading } = useGetJobOffersQuery();

	if (isLoading) {
		return (
			<div className="flex flex-col gap-4">
				<JobOfferSkeleton />
				<JobOfferSkeleton />
				<JobOfferSkeleton />
				<JobOfferSkeleton />
				<JobOfferSkeleton />
			</div>
		);
	}

	if (!data) {
		return <div>Couldn't load data</div>;
	}

	return (
		<div className="flex flex-col gap-4">
			{data.jobOffers.map((jobOffer) => (
				<Link key={jobOffer.id} to={`/?joid=${jobOffer.id}`}>
					<JobOfferCard jobOffer={jobOffer} />
				</Link>
			))}
		</div>
	);
};

export default JobOfferList;
