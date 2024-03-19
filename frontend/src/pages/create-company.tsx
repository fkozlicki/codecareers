import CompanyForm from '@/components/company-form';

const CreateCompany = () => {
	return (
		<div className="py-8 px-4">
			<div className="max-w-xl m-auto">
				<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8 text-center">
					Create company
				</h1>
				<CompanyForm />
			</div>
		</div>
	);
};

export default CreateCompany;
