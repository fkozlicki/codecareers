import { useGetJobOffersQuery } from '@/app/services/jobOffers';
import Hero from '@/components/hero';
import JobOfferDetails from '@/components/job-offer-details';
import JobOfferList from '@/components/job-offer-list';
import Empty from '@/components/ui/empty';

const Home = () => {
	const { data } = useGetJobOffersQuery();

	return (
		<div className="min-h-[calc(100vh-54px)] flex flex-col">
			<Hero />
			<div className="flex flex-1">
				{data && data.jobOffers.length === 0 ? (
					<div>
						<Empty message="There are no jobs you are looking for" />
					</div>
				) : (
					<>
						<div className="flex-1 p-4 flex flex-col gap-4 min-h-[calc(100vh-53px)]">
							<JobOfferList />
						</div>
						<div className="flex-1">
							<JobOfferDetails />
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Home;
