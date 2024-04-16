import { useGetMessagesQuery } from '@/app/services/recruitments';
import { useParams } from 'react-router-dom';

const RecruitmentChat = () => {
	const { recruitmentId } = useParams();
	const { data } = useGetMessagesQuery({ id: recruitmentId!, pageSize: 10 });

	return <div>{JSON.stringify(data)}</div>;
};

export default RecruitmentChat;
