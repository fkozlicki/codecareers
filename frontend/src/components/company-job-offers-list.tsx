import { useGetCompanyJobOffersQuery } from '@/app/services/companies';
import JobOfferCard from '@/components/job-offer-card';
import JobOfferSkeleton from '@/components/job-offer-skeleton';
import Empty from '@/components/ui/empty';
import { Link, useParams, useSearchParams } from 'react-router-dom';

const CompanyJobOffersList = () => {
	const { id } = useParams();
	const [params] = useSearchParams();
	const sort = params.get('sort');
	const { data, isLoading, isError, isUninitialized } =
		useGetCompanyJobOffersQuery({ id: id!, sort });

	if (isLoading || isUninitialized) {
		return (
			<div className="flex flex-col gap-4">
				<JobOfferSkeleton />
				<JobOfferSkeleton />
				<JobOfferSkeleton />
			</div>
		);
	}

	if (isError) {
		return <div>Couldn't load data</div>;
	}

	if (data.jobOffers.length === 0) {
		return <Empty message="Your company have no job offers yet." />;
	}

	return (
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
	);
};

export default CompanyJobOffersList;
