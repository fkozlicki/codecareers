import { Company } from '@/app/services/companies';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const CompanyCard = ({ company }: { company: Company }) => {
	const { id, name, description } = company;

	return (
		<Link to={`/my-companies/${id}`} className="">
			<Card className="p-4 h-full hover:shadow-md">
				<CardTitle>{name}</CardTitle>
				<CardDescription className="line-clamp-2">
					{description}
				</CardDescription>
			</Card>
		</Link>
	);
};

export default CompanyCard;
