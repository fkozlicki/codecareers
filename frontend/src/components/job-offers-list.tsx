import { useLazyGetJobOffersQuery } from '@/app/services/jobOffers';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Link, useSearchParams } from 'react-router-dom';
import JobOfferCard from './job-offer-card';
import JobOfferSkeleton from './job-offer-skeleton';

const JobOffersList = () => {
	const [fetchJobOffers, { data, isLoading, isFetching, isUninitialized }] =
		useLazyGetJobOffersQuery();
	const [searchParams] = useSearchParams();
	const joid = searchParams.get('joid');
	const [ref, inView] = useInView();
	const lastCursor = data?.jobOffers.at(data.jobOffers.length - 1)?.id;

	useEffect(() => {
		if (inView) {
			fetchJobOffers({ pageSize: 10, cursor: lastCursor });
		}
	}, [fetchJobOffers, inView, lastCursor]);

	if (isUninitialized) {
		return <div ref={ref}></div>;
	}

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
					<JobOfferCard
						jobOffer={jobOffer}
						selected={jobOffer.id === (joid || data.jobOffers[0].id)}
					/>
				</Link>
			))}
			{isFetching && (
				<>
					<JobOfferSkeleton />
					<JobOfferSkeleton />
					<JobOfferSkeleton />
				</>
			)}
			<div ref={ref}></div>
		</div>
	);
};

export default JobOffersList;
