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
	const { data, isLoading, isFetching, isUninitialized, isError } =
		useGetJobOffersQuery({ pageSize: 10, name });
	const [fetchJobOffers] = useLazyGetJobOffersQuery();
	const [ref, inView] = useInView();
	const joid = searchParams.get('joid');
	const cursor = data?.cursor;
	const hasNextPage = data?.hasNextPage;

	useEffect(() => {
		if (inView && !isLoading && hasNextPage) {
			fetchJobOffers({ pageSize: 10, cursor, name });
		}
	}, [inView]);

	if (isLoading || isUninitialized) {
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

	if (isError) {
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
