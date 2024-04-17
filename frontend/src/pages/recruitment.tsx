import { useGetRecruitmentQuery } from '@/app/services/recruitments';
import RecruitmentChat from '@/components/recruitment-chat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams } from 'react-router-dom';

const Recruitment = () => {
	const { recruitmentId } = useParams();
	const { data } = useGetRecruitmentQuery(recruitmentId!);

	return (
		<Tabs defaultValue="company" className="p-4">
			<div className="flex justify-center">
				<TabsList>
					<TabsTrigger value="company">Company</TabsTrigger>
					<TabsTrigger value="application">Application</TabsTrigger>
					<TabsTrigger value="chat">Chat</TabsTrigger>
				</TabsList>
			</div>
			<TabsContent value="company">Company</TabsContent>
			<TabsContent value="application">Application</TabsContent>
			<TabsContent value="chat">
				<div className="h-[calc(100vh-129px)] max-w-2xl m-auto">
					{data && <RecruitmentChat id={data.recruitment.chatId} />}
				</div>
			</TabsContent>
		</Tabs>
	);
};

export default Recruitment;