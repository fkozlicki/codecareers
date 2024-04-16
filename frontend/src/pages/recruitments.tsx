import { useGetCompanyRecruitmentsQuery } from '@/app/services/companies';
import RecruitmentCard from '@/components/recruitment-card';
import Empty from '@/components/ui/empty';
import { useParams } from 'react-router-dom';

const Recruitments = () => {
	const { id } = useParams();
	const { data, isLoading, isError, isUninitialized } =
		useGetCompanyRecruitmentsQuery(id!);

	if (isLoading || isUninitialized) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Couldn't load data</div>;
	}

	if (data.recruitments.length === 0) {
		return <Empty message="Your company have no recruitments" />;
	}

	return (
		<div>
			{data.recruitments.map((recruitment) => (
				<RecruitmentCard recruitment={recruitment} />
			))}
		</div>
	);
};

export default Recruitments;
