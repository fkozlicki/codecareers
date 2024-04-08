import {
	useGetJobOffersQuery,
	useLazyGetJobOffersQuery,
} from '@/app/services/jobOffers';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Link, useSearchParams } from 'react-router-dom';
import JobOfferCard from './job-offer-card';
import JobOfferSkeleton from './job-offer-skeleton';

const JobOffersList = () => {
	const [searchParams] = useSearchParams();
	const name = searchParams.get('name');
	const { data, isLoading, isFetching, isUninitialized } = useGetJobOffersQuery(
		{ pageSize: 2, name }
	);
	const [fetchJobOffers] = useLazyGetJobOffersQuery();
	const [ref, inView] = useInView();
	const joid = searchParams.get('joid');
	const cursor = data?.jobOffers.at(-1)?.id;

	useEffect(() => {
		if (inView && !isLoading) {
			fetchJobOffers({ pageSize: 2, cursor, name });
		}
	}, [inView, cursor]);

	if (isLoading || isUninitialized) {
		return (
			<div ref={ref} className="flex flex-col gap-4">
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
