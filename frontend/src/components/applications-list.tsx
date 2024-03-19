import { useLazyGetJobOfferApplicationsQuery } from '@/app/services/jobOffers';
import ApplicationCard from '@/components/application-card';
import JobOfferSkeleton from '@/components/job-offer-skeleton';
import Empty from '@/components/ui/empty';
import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

const ApplicationsList = () => {
	const { jobOfferId } = useParams();
	const [fetchApplications, { data, isFetching }] =
		useLazyGetJobOfferApplicationsQuery();
	const [searchParams] = useSearchParams();
	const sort = searchParams.get('sort');

	useEffect(() => {
		if (!jobOfferId) {
			return;
		}
		fetchApplications({ id: jobOfferId, sort: sort });
	}, [sort, jobOfferId]);

	if (isFetching) {
		return (
			<div className="flex flex-col gap-4">
				<JobOfferSkeleton />
				<JobOfferSkeleton />
				<JobOfferSkeleton />
			</div>
		);
	}

	if (!data) {
		return <div>Couldn't load data</div>;
	}

	return (
		<>
			{data.applications.length > 0 ? (
				<div className="flex flex-col gap-4">
					{data.applications.map((application) => (
						<ApplicationCard key={application.id} application={application} />
					))}
				</div>
			) : (
				<Empty
					message={`Your job offer has 0 ${
						sort ? sort.toLowerCase() : 'new'
					} applications`}
				/>
			)}
		</>
	);
};

export default ApplicationsList;
