import { useGetJobOfferApplicationsQuery } from '@/app/services/jobOffers';
import ApplicationCard from '@/components/application-card';
import JobOfferSkeleton from '@/components/job-offer-skeleton';
import Empty from '@/components/ui/empty';
import { useParams, useSearchParams } from 'react-router-dom';

const ApplicationsList = () => {
	const { jobOfferId } = useParams();
	const [searchParams] = useSearchParams();
	const sort = searchParams.get('sort');
	const { data, isLoading, isUninitialized, isError } =
		useGetJobOfferApplicationsQuery({ id: jobOfferId!, sort });

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

	if (data.applications.length === 0) {
		return (
			<Empty
				message={`Your job offer has 0 ${
					sort ? sort.toLowerCase() : 'new'
				} applications`}
			/>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			{data.applications.map((application) => (
				<ApplicationCard key={application.id} application={application} />
			))}
		</div>
	);
};

export default ApplicationsList;
