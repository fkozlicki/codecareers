import { useGetJobOfferQuery } from '@/app/services/jobOffers';
import JobOfferApplicationsList from '@/components/job-offer-applications-list';
import JobOfferCTA from '@/components/job-offer-cta';
import JobOfferTabs from '@/components/job-offer-tabs';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Loader } from 'lucide-react';
import { Navigate, useParams } from 'react-router-dom';

const CompanyJobOffer = () => {
	const { jobOfferId } = useParams();
	const { data, isLoading, isError, isUninitialized, error } =
		useGetJobOfferQuery(jobOfferId!);

	if (isLoading || isUninitialized) {
		return (
			<div className="grid place-items-center h-full">
				<Loader className="animate-spin w-8 h-8" />
			</div>
		);
	}

	if (isError) {
		if ((error as FetchBaseQueryError).status === 404) {
			return <Navigate to="/404" />;
		}

		return <div>Couldn't load data</div>;
	}

	const { position, published } = data.jobOffer;

	return (
		<>
			<JobOfferCTA position={position} published={published} />
			<JobOfferTabs />
			<JobOfferApplicationsList />
		</>
	);
};

export default CompanyJobOffer;
