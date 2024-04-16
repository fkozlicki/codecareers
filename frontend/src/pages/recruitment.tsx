import RecruitmentChat from '@/components/recruitment-chat';
import RecruitmentOverview from '@/components/recruitment-overview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Recruitment = () => {
	return (
		<div>
			<Tabs defaultValue="overview" className="">
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
					<RecruitmentChat />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Recruitment;
