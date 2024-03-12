import { useAppSelector } from '@/app/hooks';
import { useGetCompaniesQuery } from '@/app/services/companies';
import CompanyCard from '@/components/company-card';
import CompanySkeleton from '@/components/company-skeleton';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Companies = () => {
	const { user, status } = useAppSelector((state) => state.auth);
	const { data, isLoading } = useGetCompaniesQuery(user?.id, {
		skip: status !== 'authenticated',
	});

	return (
		<div className="py-8">
			<div className="max-w-3xl m-auto">
				<div className="flex items-center justify-between mb-8">
					<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
						Your companies
					</h1>
					<Link to="/my-companies/create">
						<Button size="lg">Create</Button>
					</Link>
				</div>
				<div>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
						{isLoading && (
							<>
								<CompanySkeleton />
								<CompanySkeleton />
								<CompanySkeleton />
								<CompanySkeleton />
								<CompanySkeleton />
							</>
						)}
						{data &&
							data.companies.map((company) => (
								<CompanyCard key={company.id} company={company} />
							))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Companies;
