import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Companies = () => {
	return (
		<div className="py-8">
			<div className="max-w-xl m-auto">
				<div className="flex items-center justify-between">
					<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
						Your companies
					</h1>
					<Link to="/my-companies/create">
						<Button size="lg">Create</Button>
					</Link>
				</div>
				<div></div>
			</div>
		</div>
	);
};

export default Companies;
