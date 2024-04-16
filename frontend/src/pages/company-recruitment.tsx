import { useGetRecruitmentQuery } from '@/app/services/recruitments';
import RecruitmentChat from '@/components/recruitment-chat';
import RecruitmentOverview from '@/components/recruitment-overview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams } from 'react-router-dom';

const CompanyRecruitment = () => {
	const { recruitmentId } = useParams();
	const { data } = useGetRecruitmentQuery(recruitmentId!);

	return (
		<Tabs defaultValue="overview">
			<div className="flex justify-center">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="chat">Chat</TabsTrigger>
				</TabsList>
			</div>
			<TabsContent value="overview">
				<RecruitmentOverview />
			</TabsContent>
			<TabsContent value="chat">
				<div className="h-[calc(100vh-282px)]">
					{data && <RecruitmentChat id={data.recruitment.chatId} />}
				</div>
			</TabsContent>
		</Tabs>
	);
};

export default CompanyRecruitment;
