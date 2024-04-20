import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDownIcon } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

const CompanyJobOffersHeader = () => {
	const { companyId } = useParams();
	const [params] = useSearchParams();
	const sort = params.get('sort') ?? 'all';

	return (
		<div className="flex justify-between items-center mb-8">
			<Link to={`/my-companies/${companyId}/job-offers/create`}>
				<Button>Create</Button>
			</Link>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline">
						<span className="capitalize">{sort}</span>
						<ChevronDownIcon className="ml-4 w-4 h-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuRadioGroup value={sort}>
						<Link to={`/my-companies/${companyId}/job-offers`}>
							<DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
						</Link>
						<Link to={`/my-companies/${companyId}/job-offers?sort=public`}>
							<DropdownMenuRadioItem value="public">
								Public
							</DropdownMenuRadioItem>
						</Link>
						<Link to={`/my-companies/${companyId}/job-offers?sort=draft`}>
							<DropdownMenuRadioItem value="draft">Draft</DropdownMenuRadioItem>
						</Link>
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default CompanyJobOffersHeader;
