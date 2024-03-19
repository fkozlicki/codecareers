import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CompaniesHeader = () => {
	return (
		<div className="flex items-center justify-between mb-8">
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-4xl text-center">
				Your companies
			</h1>
			<Link to="/my-companies/create">
				<Button size="lg">Create</Button>
			</Link>
		</div>
	);
};

export default CompaniesHeader;
