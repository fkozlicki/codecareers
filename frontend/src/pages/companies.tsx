import CompaniesHeader from '@/components/companies-header';
import CompaniesList from '@/components/companies-list';

const Companies = () => {
	return (
		<div className="py-8 px-4">
			<div className="max-w-3xl m-auto">
				<CompaniesHeader />
				<CompaniesList />
			</div>
		</div>
	);
};

export default Companies;
