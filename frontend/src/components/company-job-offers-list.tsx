import { useLazyGetCompanyJobOffersQuery } from '@/app/services/companies';
import JobOfferCard from '@/components/job-offer-card';
import JobOfferSkeleton from '@/components/job-offer-skeleton';
import Empty from '@/components/ui/empty';
import { useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

const CompanyJobOffersList = () => {
	const { id } = useParams();
	const [params] = useSearchParams();
	const sort = params.get('sort') ?? 'all';
	const [fetchCompanies, { isLoading, data }] =
		useLazyGetCompanyJobOffersQuery();

	useEffect(() => {
		if (!id) {
			return;
		}
		fetchCompanies({
			id,
			sort: sort === 'all' ? undefined : sort,
		});
	}, [sort, id]);

	if (isLoading) {
		return (
			<div className="flex flex-col gap-4">
				<JobOfferSkeleton />
				<JobOfferSkeleton />
				<JobOfferSkeleton />
			</div>
		);
	}

	if (!data) {
		return <div>Couldn't load data</div>;
	}

	return (
		<>
			{data.jobOffers.length > 0 ? (
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
			) : (
				<Empty message="Your company have no job offers yet." />
			)}
		</>
	);
};

export default CompanyJobOffersList;
