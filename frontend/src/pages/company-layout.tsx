import { useGetCompanyQuery } from '@/app/services/companies';
import CompanyHeader from '@/components/company-header';
import CompanyMobileNavigation from '@/components/company-mobile-navigation';
import CompanyNavigation from '@/components/company-navigation';
import { Outlet, useParams } from 'react-router-dom';

const CompanyLayout = () => {
	const { id } = useParams();

	const { data } = useGetCompanyQuery(id!);

	return (
		<>
			<CompanyMobileNavigation />
			{data && (
				<CompanyHeader
					name={data.company.name}
					description={data.company.description}
				/>
			)}
			<div className="flex max-w-4xl m-auto px-4 lg:px-0">
				<CompanyNavigation />
				<div className="flex-1 pb-4">
					<Outlet />
				</div>
			</div>
		</>
	);
};

export default CompanyLayout;
