import { useGetCompanyQuery } from '@/app/services/companies';
import CompanyForm from '@/components/company-form';
import { Navigate, useParams } from 'react-router-dom';
import CompanyFormSkeleton from '../components/company-form-skeleton';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

const Company = () => {
	const { companyId } = useParams();
	const { data, isLoading, isError, isUninitialized, error } =
		useGetCompanyQuery(companyId!);

	if (isLoading || isUninitialized) {
		return <CompanyFormSkeleton />;
	}

	if (isError) {
		if ((error as FetchBaseQueryError).status === 404) {
			return <Navigate to="/404" />;
		}

		return <div>Unexpected error</div>;
	}

	return <CompanyForm initialData={data.company} />;
};

export default Company;
