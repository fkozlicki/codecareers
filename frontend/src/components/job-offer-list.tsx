import { Link } from 'react-router-dom';
import JobOfferCard from './job-offer-card';
import { useGetJobOffersQuery } from '@/app/services/jobOffers';

const JobOfferList = () => {
	const { data } = useGetJobOffersQuery();

	return (
		<div className="flex-1 p-4 flex flex-col gap-4 min-h-[calc(100vh-53px)]">
			{data?.jobOffers.map((jobOffer) => (
				<Link key={jobOffer.id} to={`/?joid=${jobOffer.id}`}>
					<JobOfferCard jobOffer={jobOffer} />
				</Link>
			))}
		</div>
	);
};

export default JobOfferList;
