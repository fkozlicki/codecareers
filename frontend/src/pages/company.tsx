import { useGetCompanyQuery } from '@/app/services/companies';
import CompanyForm from '@/components/company-form';
import { useParams } from 'react-router-dom';

const Company = () => {
	const { id } = useParams();
	const { data, isLoading, isError } = useGetCompanyQuery(id!);

	if (isLoading) {
		return <div>Loading..</div>;
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
