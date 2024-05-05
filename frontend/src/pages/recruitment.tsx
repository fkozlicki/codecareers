import { useGetRecruitmentQuery } from '@/app/services/recruitments';
import RecruitmentApplication from '@/components/recruitment-application';
import RecruitmentChat from '@/components/recruitment-chat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import RecruitmentDetails from '../components/recruitment-details';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

const Recruitment = () => {
	const { recruitmentId } = useParams();
	const [searchParams] = useSearchParams();
	const { data, isLoading, isUninitialized, isError, error } =
		useGetRecruitmentQuery(recruitmentId!);
	const view = searchParams.get('view');

	if (isLoading || isUninitialized) {
		return <div>Loading</div>;
	}

	if (isError) {
		if ((error as FetchBaseQueryError).status === 404) {
			return <Navigate to="/404" />;
		}

		return <div>Couldn't load data</div>;
	}

	return (
		<Tabs defaultValue="job-offer" value={view ?? undefined} className="p-4">
			<div className="flex justify-center mb-8">
				<TabsList>
					<Link to={`/my-recruitments/${recruitmentId}?view=job-offer`}>
						<TabsTrigger value="job-offer">Job offer</TabsTrigger>
					</Link>
					<Link to={`/my-recruitments/${recruitmentId}?view=application`}>
						<TabsTrigger value="application">Application</TabsTrigger>
					</Link>
					<Link to={`/my-recruitments/${recruitmentId}?view=chat`}>
						<TabsTrigger value="chat">Chat</TabsTrigger>
					</Link>
				</TabsList>
			</div>
			{data && (
				<>
					<TabsContent value="job-offer">
						<RecruitmentDetails
							open={data.recruitment.open}
							createdAt={data.recruitment.createdAt}
							jobOffer={data.recruitment.application.jobOffer}
						/>
					</TabsContent>
					<TabsContent value="application">
						<RecruitmentApplication
							application={data.recruitment.application}
						/>
					</TabsContent>
					<TabsContent value="chat">
						<div className="h-[calc(100vh-153px)] max-w-2xl m-auto">
							<RecruitmentChat chat={data.recruitment.chat} />
						</div>
					</TabsContent>
				</>
			)}
		</Tabs>
	);
};

export default Recruitment;
