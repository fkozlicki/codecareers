import { useGetJobOfferQuery } from '@/app/services/jobOffers';
import JobOfferApplicationsList from '@/components/job-offer-applications-list';
import JobOfferTabs from '@/components/job-offer-tabs';
import JobOfferHeader from '@/components/job-offer-header';
import { Loader } from 'lucide-react';
import { useParams } from 'react-router-dom';

const CompanyJobOffer = () => {
	const { jobOfferId } = useParams();
	const { data, isLoading } = useGetJobOfferQuery(jobOfferId!);

	if (isLoading) {
		return (
			<div className="grid place-items-center h-full">
				<Loader className="animate-spin w-8 h-8" />
			</div>
		);
	}

	if (!data) {
		return <div>Couldn't load data</div>;
	}

	const { position, published } = data.jobOffer;

	return (
		<>
			<JobOfferHeader position={position} published={published} />
			<JobOfferTabs />
			<JobOfferApplicationsList />
		</>
	);
};

export default CompanyJobOffer;
