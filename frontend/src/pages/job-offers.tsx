import { useGetJobOffersQuery } from '@/app/services/companies';
import JobOfferCard from '@/components/job-offer-card';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const JobOffers = () => {
	const { id } = useParams();
	const { data } = useGetJobOffersQuery(id!);
	const [sort, setSort] = useState('All');

	return (
		<div>
			<div className="flex justify-between items-center mb-4">
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
						<DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
							<DropdownMenuRadioItem value="All">All</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="Draft">Draft</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="Public">
								Public
							</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="flex flex-col gap-4">
				{data?.jobOffers.map((jobOffer) => (
					<JobOfferCard key={jobOffer.id} jobOffer={jobOffer} />
				))}
			</div>
		</div>
	);
};

export default JobOffers;
