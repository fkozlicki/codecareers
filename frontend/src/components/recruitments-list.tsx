import { useGetRecruitmentsQuery } from '@/app/services/recruitments';
import { Link } from 'react-router-dom';

const RecruitmentsList = () => {
	const { data, isUninitialized, isLoading, isError } =
		useGetRecruitmentsQuery();

	if (isUninitialized || isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Couldn't load data</div>;
	}

	return (
		<div className="flex flex-col gap-2">
			{data.recruitments.map((recruitment) => (
				<Link to={`/my-recruitments/${recruitment.id}`} key={recruitment.id}>
					<div>{recruitment.jobOffer.position}</div>
				</Link>
			))}
		</div>
	);
};

export default RecruitmentsList;
