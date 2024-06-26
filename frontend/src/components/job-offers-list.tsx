import {
	useGetJobOffersQuery,
	useLazyGetJobOffersQuery,
} from '@/app/services/jobOffers';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Link, useSearchParams } from 'react-router-dom';
import JobOfferCard from './job-offer-card';
import JobOfferSkeleton from './job-offer-skeleton';
import Empty from './ui/empty';

const JobOffersList = () => {
	const [searchParams] = useSearchParams();
	const position = searchParams.get('position');
	const { data, isLoading, isFetching, isUninitialized, isError } =
		useGetJobOffersQuery({ pageSize: 10, position });
	const [fetchJobOffers] = useLazyGetJobOffersQuery();
	const [ref, inView] = useInView();
	const joid = searchParams.get('joid') ?? data?.jobOffers[0].id;
	const cursor = data?.cursor;
	const hasNextPage = data?.hasNextPage;

	useEffect(() => {
		if (inView && !isLoading && hasNextPage) {
			fetchJobOffers({ pageSize: 10, cursor, position });
		}
	}, [inView]);

	if (isLoading || isUninitialized) {
		return (
			<div className="flex flex-col gap-4 p-4">
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
		<div className="flex flex-col gap-4 p-4">
			{data.jobOffers.map((jobOffer) => (
				<Link key={jobOffer.id} to={`/?joid=${jobOffer.id}`}>
					<JobOfferCard jobOffer={jobOffer} selected={jobOffer.id === joid} />
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
			{!data.hasNextPage && (
				<div className="grid place-items-center flex-1">
					<Empty message="No more job offers" />
				</div>
			)}
		</div>
	);
};

export default JobOffersList;
