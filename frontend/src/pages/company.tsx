import { useGetCompanyQuery } from '@/app/services/companies';
import CompanyForm from '@/components/company-form';
import { useParams } from 'react-router-dom';
import CompanyFormSkeleton from './company-form-skeleton';

const Company = () => {
	const { companyId } = useParams();
	const { data, isLoading, isError, isUninitialized } = useGetCompanyQuery(
		companyId!
	);

	if (isLoading || isUninitialized) {
		return <CompanyFormSkeleton />;
	}

	if (isError) {
		return <div>Unexpected error</div>;
	}

	return <CompanyForm initialData={data.company} />;
};

export default Company;
