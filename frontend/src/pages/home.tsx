import Hero from '@/components/hero';
import JobOfferDetails from '@/components/job-offer-details';
import JobOfferList from '@/components/job-offer-list';

const Home = () => {
	return (
		<div className="min-h-[calc(100vh-54px)] flex flex-col">
			<Hero />
			<div className="flex flex-1">
				<JobOfferList />
				<JobOfferDetails />
			</div>
		</div>
	);
};

export default Home;
