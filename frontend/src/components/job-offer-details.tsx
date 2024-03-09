import {
	useGetJobOffersQuery,
	useLazyGetJobOfferQuery,
} from '@/app/services/jobOffers';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const JobOfferDetails = () => {
	const [searchParams] = useSearchParams();
	const { data: jobOffersData } = useGetJobOffersQuery();
	const [queryJobOffer, { data, isLoading }] = useLazyGetJobOfferQuery();
	const jobOfferId = searchParams.get('joid');

	useEffect(() => {
		if (jobOfferId) {
			queryJobOffer(jobOfferId);
		} else if (jobOffersData) {
			queryJobOffer(jobOffersData.jobOffers[0].id);
		}
	}, [jobOfferId, queryJobOffer, jobOffersData]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!data) {
		return <div>Couldn't load data</div>;
	}

	const {
		position,
		company,
		salaryFrom,
		salaryTo,
		salaryCurrency,
		level,
		employmentType,
		workType,
		createdAt,
		description,
	} = data.jobOffer;

	return (
		<div className="flex-1 p-4">
			<div className="border rounded-md overflow-hidden">
				<AspectRatio ratio={6 / 1} className="overflow-hidden">
					<img
						src="https://img.freepik.com/premium-vector/technology-global-blue-wide-banner-design-background-abstract-3d-banner-design-with-dark-blue-technology-geometric-background-vector-illustration_181182-27934.jpg?w=1380"
						alt=""
						className="object-cover"
					/>
				</AspectRatio>
				<Avatar className="rounded -translate-y-1/2 ml-4 w-16 h-16">
					<AvatarFallback className="rounded">AV</AvatarFallback>
				</Avatar>
				<div className="px-4 pb-4">
					<div className="flex justify-between">
						<div className="flex gap-2">
							<h2>{position}</h2>
							<span>
								{salaryFrom} - {salaryTo} {salaryCurrency}
							</span>
						</div>
						<span>{dayjs(createdAt).fromNow()}</span>
					</div>
					<span>{company.name}</span>
					<div className="flex gap-4">
						<Badge variant="outline">{level}</Badge>
						<Badge variant="outline">{workType}</Badge>
						<Badge variant="outline">{employmentType}</Badge>
					</div>
					<p>{description}</p>
				</div>
			</div>
		</div>
	);
};

export default JobOfferDetails;
