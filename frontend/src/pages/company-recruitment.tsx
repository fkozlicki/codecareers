import { useGetRecruitmentQuery } from '@/app/services/recruitments';
import RecruitmentChat from '@/components/recruitment-chat';
import RecruitmentOverview from '@/components/recruitment-overview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';

const CompanyRecruitment = () => {
	const { recruitmentId, companyId } = useParams();
	const { data, isLoading, isUninitialized, isError, error } =
		useGetRecruitmentQuery(recruitmentId!);
	const [searchParams] = useSearchParams();
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
		<Tabs defaultValue="overview" value={view ?? undefined}>
			<div className="flex justify-center">
				<TabsList>
					<Link
						to={`/my-companies/${companyId}/recruitments/${recruitmentId}?view=overview`}
					>
						<TabsTrigger value="overview">Overview</TabsTrigger>
					</Link>
					<Link
						to={`/my-companies/${companyId}/recruitments/${recruitmentId}?view=chat`}
					>
						<TabsTrigger value="chat">Chat</TabsTrigger>
					</Link>
				</TabsList>
			</div>
			<TabsContent value="overview">
				<RecruitmentOverview />
			</TabsContent>
			<TabsContent value="chat">
				<div className="h-[calc(100vh-282px)]">
					<RecruitmentChat chat={data.recruitment.chat} />
				</div>
			</TabsContent>
		</Tabs>
	);
};

export default CompanyRecruitment;
