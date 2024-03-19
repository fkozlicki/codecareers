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

const JobOffersHeader = () => {
	const { id } = useParams();
	const [params] = useSearchParams();
	const sort = params.get('sort') ?? 'all';

	return (
		<div className="flex justify-between items-center mb-8">
			<Link to={`/my-companies/${id}/job-offers/create`}>
				<Button>Create</Button>
			</Link>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline">
						Show
						<ChevronDownIcon className="ml-4 w-4 h-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuRadioGroup value={sort}>
						<Link to={`/my-companies/${id}/job-offers`}>
							<DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
						</Link>
						<Link to={`/my-companies/${id}/job-offers?sort=public`}>
							<DropdownMenuRadioItem value="public">
								Public
							</DropdownMenuRadioItem>
						</Link>
						<Link to={`/my-companies/${id}/job-offers?sort=draft`}>
							<DropdownMenuRadioItem value="draft">Draft</DropdownMenuRadioItem>
						</Link>
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export default JobOffersHeader;
