import { useGetRecruitmentsQuery } from '@/app/services/recruitments';
import { Link } from 'react-router-dom';
import Empty from './ui/empty';
import JobOfferSkeleton from './job-offer-skeleton';
import JobOfferCard from './job-offer-card';

const RecruitmentsList = () => {
	const { data, isUninitialized, isLoading, isError } =
		useGetRecruitmentsQuery();

	if (isLoading || isUninitialized) {
		return (
			<div className="flex flex-col gap-4">
				<JobOfferSkeleton />
				<JobOfferSkeleton />
				<JobOfferSkeleton />
			</div>
		);
	}

	if (isError) {
		return <div>Couldn't load data</div>;
	}

	if (data.recruitments.length === 0) {
		return <Empty message="You have no recruitments yet" />;
	}

	return (
		<div className="flex flex-col gap-2">
			{data.recruitments.map((recruitment) => (
				<Link to={`/my-recruitments/${recruitment.id}`} key={recruitment.id}>
					<JobOfferCard jobOffer={recruitment.jobOffer} />
				</Link>
			))}
		</div>
	);
};

export default RecruitmentsList;
