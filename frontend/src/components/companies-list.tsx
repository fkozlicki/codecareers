import { useAppSelector } from '@/app/hooks';
import { useGetCompaniesQuery } from '@/app/services/companies';
import CompanySkeleton from '@/components/company-skeleton';
import CompanyCard from '@/components/company-card';
import Empty from '@/components/ui/empty';

const CompaniesList = () => {
	const { user, status } = useAppSelector((state) => state.auth);
	const { data, isLoading, isUninitialized, isError } = useGetCompaniesQuery(
		user?.id,
		{
			skip: status !== 'authenticated',
		}
	);

	if (isLoading || isUninitialized) {
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				<CompanySkeleton />
				<CompanySkeleton />
				<CompanySkeleton />
				<CompanySkeleton />
				<CompanySkeleton />
			</div>
		);
	}

	if (isError) {
		return <div>Couldn't load data</div>;
	}

	if (data.companies.length === 0) {
		return <Empty message="You have no companies yet" />;
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
			{data.companies.map((company) => (
				<CompanyCard key={company.id} company={company} />
			))}
		</div>
	);
};

export default CompaniesList;
