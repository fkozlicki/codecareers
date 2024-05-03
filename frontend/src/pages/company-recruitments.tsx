import { useGetCompanyRecruitmentsQuery } from '@/app/services/companies';
import JobOfferSkeleton from '@/components/job-offer-skeleton';
import RecruitmentCard from '@/components/recruitment-card';
import Empty from '@/components/ui/empty';
import { useParams } from 'react-router-dom';

const CompanyRecruitments = () => {
	const { companyId } = useParams();
	const { data, isLoading, isError, isUninitialized } =
		useGetCompanyRecruitmentsQuery(companyId!);

	if (isLoading || isUninitialized) {
		return (
			<div className="flex flex-col gap-4">
				<JobOfferSkeleton />
				<JobOfferSkeleton />
				<JobOfferSkeleton />
			</div>
		);
	}

	if (isError) {
		return <div>Couldn't load data</div>;
	}

	if (data.recruitments.length === 0) {
		return <Empty message="Your company have no recruitments" />;
	}

	return (
		<div className="flex flex-col gap-4">
			{data.recruitments.map((recruitment) => (
				<RecruitmentCard key={recruitment.id} recruitment={recruitment} />
			))}
		</div>
	);
};

export default CompanyRecruitments;
