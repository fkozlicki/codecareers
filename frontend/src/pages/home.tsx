import Hero from '@/components/hero';
import JobOfferDetails from '@/components/job-offer-details';
import JobOffersList from '@/components/job-offers-list';

const Home = () => {
	return (
		<div className="min-h-[calc(100vh-54px)] flex flex-col">
			<Hero />
			<div className="flex flex-1">
				<div className="flex-1 p-4 flex flex-col gap-4 min-h-[calc(100vh-53px)]">
					<JobOffersList />
				</div>
				<div className="flex-1 hidden md:block">
					<JobOfferDetails />
				</div>
			</div>
		</div>
	);
};

export default Home;
