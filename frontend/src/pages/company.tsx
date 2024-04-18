import { useGetCompanyQuery } from '@/app/services/companies';
import CompanyForm from '@/components/company-form';
import { useParams } from 'react-router-dom';
import CompanyFormSkeleton from './company-form-skeleton';

const Company = () => {
	const { companyId } = useParams();
	const { data, isLoading, isError } = useGetCompanyQuery(companyId!);

	if (isLoading) {
		return <CompanyFormSkeleton />;
	}

	if (isError) {
		return <div>Unexpected error</div>;
	}

	if (!data) {
		return <div>Coudln't load data</div>;
	}

	return <CompanyForm initialData={data.company} />;
};

export default Company;
