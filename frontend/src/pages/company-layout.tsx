import { useGetCompanyQuery } from '@/app/services/companies';
import CompanyHeader from '@/components/company-header';
import CompanyMobileNavigation from '@/components/company-mobile-navigation';
import CompanyNavigation from '@/components/company-navigation';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Navigate, Outlet, useParams } from 'react-router-dom';

const CompanyLayout = () => {
	const { companyId } = useParams();

	const { data, error, isLoading, isUninitialized, isError } =
		useGetCompanyQuery(companyId!);

	if (isLoading || isUninitialized) {
		return <div>Loading</div>;
	}

	if (isError) {
		if ((error as FetchBaseQueryError).status === 404) {
			return <Navigate to="/404" />;
		}

		return <div>Couldn't load data</div>;
	}

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
