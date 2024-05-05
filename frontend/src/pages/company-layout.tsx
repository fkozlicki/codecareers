import { Company, companiesApi } from '@/app/services/companies';
import { store } from '@/app/store';
import CompanyHeader from '@/components/company-header';
import CompanyMobileNavigation from '@/components/company-mobile-navigation';
import CompanyNavigation from '@/components/company-navigation';
import { LoaderFunctionArgs, Outlet, useLoaderData } from 'react-router-dom';

type CompanyParams = { companyId: string };

export const companyLoader = async ({ params }: LoaderFunctionArgs) => {
	const p = store.dispatch(
		companiesApi.endpoints.getCompany.initiate(
			(params as CompanyParams).companyId
		)
	);

	try {
		const { company } = await p.unwrap();
		return company;
	} catch (error) {
		throw new Response('', {
			status: 404,
			statusText: 'Not Found',
		});
	} finally {
		p.unsubscribe();
	}
};

const CompanyLayout = () => {
	const { name, description } = useLoaderData() as Company;

	return (
		<>
			<CompanyMobileNavigation />
			<CompanyHeader name={name} description={description} />
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
