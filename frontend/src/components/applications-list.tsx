import { useGetApplicationsQuery } from '@/app/services/applications';
import { useSearchParams } from 'react-router-dom';
import Empty from './ui/empty';
import SetMeetingDialog from './set-meeting-dialog';
import JobOfferCard from './job-offer-card';

const ApplicationsList = () => {
	const [searchParams] = useSearchParams();
	const sort = searchParams.get('sort');
	const { data, isLoading, isUninitialized, isError } =
		useGetApplicationsQuery(sort);

	if (isLoading || isUninitialized) {
		return <div>Loading..</div>;
	}

	if (isError) {
		return <div>Couldn't load data</div>;
	}

	if (data.applications.length === 0) {
		return (
			<Empty
				message={`You have no ${sort?.toLowerCase() ?? 'pending'} applications`}
			/>
		);
	}

	return (
		<div className="flex flex-col gap-4 px-4">
			{data.applications.map((application) => (
				<SetMeetingDialog key={application.id}>
					<div>
						<JobOfferCard jobOffer={application.jobOffer} />
					</div>
				</SetMeetingDialog>
			))}
		</div>
	);
};

export default ApplicationsList;
