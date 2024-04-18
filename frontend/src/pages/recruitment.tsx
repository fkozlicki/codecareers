import { useGetRecruitmentQuery } from '@/app/services/recruitments';
import RecruitmentApplication from '@/components/recruitment-application';
import RecruitmentChat from '@/components/recruitment-chat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams } from 'react-router-dom';
import RecruitmentJobOffer from './recruitment-job-offer';

const Recruitment = () => {
	const { recruitmentId } = useParams();
	const { data } = useGetRecruitmentQuery(recruitmentId!);

	return (
		<Tabs defaultValue="job-offer" className="p-4">
			<div className="flex justify-center mb-8">
				<TabsList>
					<TabsTrigger value="job-offer">Job offer</TabsTrigger>
					<TabsTrigger value="application">Application</TabsTrigger>
					<TabsTrigger value="chat">Chat</TabsTrigger>
				</TabsList>
			</div>
			{data && (
				<>
					<TabsContent value="job-offer">
						<RecruitmentJobOffer
							jobOffer={data.recruitment.application.jobOffer}
						/>
					</TabsContent>
					<TabsContent value="application">
						<RecruitmentApplication
							application={data.recruitment.application}
						/>
					</TabsContent>
					<TabsContent value="chat">
						<div className="h-[calc(100vh-129px)] max-w-2xl m-auto">
							<RecruitmentChat id={data.recruitment.chatId} />
						</div>
					</TabsContent>
				</>
			)}
		</Tabs>
	);
};

export default Recruitment;
