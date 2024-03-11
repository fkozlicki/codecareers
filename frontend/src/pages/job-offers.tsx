import { useLazyGetCompanyJobOffersQuery } from '@/app/services/companies';
import JobOfferCard from '@/components/job-offer-card';
import JobOfferSkeleton from '@/components/job-offer-skeleton';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Empty from '@/components/ui/empty';
import { ChevronDownIcon } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

const JobOffers = () => {
	const { id } = useParams();
	const [fetchCompanies, { isLoading, data }] =
		useLazyGetCompanyJobOffersQuery();
	const [params] = useSearchParams();
	const sort = params.get('sort') ?? 'all';

	useEffect(() => {
		if (!id) {
			return;
		}
		fetchCompanies({
			id,
			sort: sort === 'all' ? undefined : sort,
		});
	}, [sort, id]);

	return (
		<div>
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
								<DropdownMenuRadioItem value="draft">
									Draft
								</DropdownMenuRadioItem>
							</Link>
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			{isLoading && (
				<div className="flex flex-col gap-4">
					<JobOfferSkeleton />
					<JobOfferSkeleton />
					<JobOfferSkeleton />
				</div>
			)}
			{data?.jobOffers.length === 0 && (
				<Empty message="Your company have no job offers yet." />
			)}
			{data && data.jobOffers.length > 0 && (
				<div className="flex flex-col gap-4">
					{data.jobOffers.map((jobOffer) => (
						<Link
							key={jobOffer.id}
							to={`/my-companies/${id}/job-offers/${jobOffer.id}`}
						>
							<JobOfferCard jobOffer={jobOffer} admin />
						</Link>
					))}
				</div>
			)}
		</div>
	);
};

export default JobOffers;
