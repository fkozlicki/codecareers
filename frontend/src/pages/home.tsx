import { useGetJobOffersQuery } from '@/app/services/jobOffers';
import Hero from '@/components/hero';
import JobOfferDetails from '@/components/job-offer-details';
import JobOffersList from '@/components/job-offers-list';
import Empty from '@/components/ui/empty';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'react-router-dom';

const Home = () => {
	const [searchParams] = useSearchParams();
	const position = searchParams.get('position');
	const { data } = useGetJobOffersQuery({ pageSize: 10, position });

	const empty = data && data.jobOffers.length === 0;

	return (
		<div className="min-h-[calc(100vh-54px)] flex flex-col">
			<Hero />
			<div
				className={cn('flex flex-1', { 'items-center justify-center': empty })}
			>
				{empty ? (
					<Empty message="There are no job offers you are looking for" />
				) : (
					<>
						<div className="flex-1 p-4 flex flex-col gap-4 min-h-[calc(100vh-53px)]">
							<JobOffersList />
						</div>
						<div className="flex-1 hidden md:block">
							{data && <JobOfferDetails />}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Home;
