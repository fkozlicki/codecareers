import { useGetJobOffersQuery } from '@/app/services/jobOffers';
import JobOfferDetails from '@/components/job-offer-details';
import JobOffersList from '@/components/job-offers-list';
import Empty from '@/components/ui/empty';
import { useSearchParams } from 'react-router-dom';

const JobOffersPanel = () => {
	const [searchParams] = useSearchParams();
	const position = searchParams.get('position');
	const { data, isError } = useGetJobOffersQuery({ pageSize: 10, position });

	const empty = data?.jobOffers.length === 0;

	if (empty) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<Empty message="There are no job offers you are looking for" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex flex-1 items-center justify-center">
				<p>Couldn't load data</p>
			</div>
		);
	}

	return (
		<div className="flex flex-1">
			<div className="flex-1 flex flex-col gap-4 min-h-[calc(100vh-53px)]">
				<JobOffersList />
			</div>
			<div className="flex-1 hidden md:block">
				<JobOfferDetails />
			</div>
		</div>
	);
};

export default JobOffersPanel;
