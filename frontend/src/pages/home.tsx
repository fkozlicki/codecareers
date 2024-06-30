import Hero from '@/components/hero';
import JobOffersPanel from '@/components/job-offers-panel';

const Home = () => {
	return (
		<div className="min-h-[calc(100vh-54px)] flex flex-col">
			<Hero />
			<JobOffersPanel />
		</div>
	);
};

export default Home;
