import { useLazyGetApplicationsQuery } from '@/app/services/applications';
import JobOfferCard from '@/components/job-offer-card';
import JobOfferSkeleton from '@/components/job-offer-skeleton';
import SetMeetingDialog from '@/components/set-meeting-dialog';
import Empty from '@/components/ui/empty';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const Applications = () => {
	const [fetchApplications, { data, isLoading, isFetching }] =
		useLazyGetApplicationsQuery();
	const [searchParams] = useSearchParams();
	const sort = searchParams.get('sort');

	useEffect(() => {
		fetchApplications(sort);
	}, [sort]);

	if (isLoading || isFetching) {
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
				<div className="flex flex-col gap-4 px-4">
					{data.applications.map((application) => (
						<SetMeetingDialog key={application.id}>
							<div>
								<JobOfferCard jobOffer={application.jobOffer} />
							</div>
						</SetMeetingDialog>
					))}
				</div>
			) : (
				<div>
					<Empty
						message={`You have no ${
							sort?.toLowerCase() ?? 'pending'
						} applications`}
					/>
				</div>
			)}
		</>
	);
};

export default Applications;
