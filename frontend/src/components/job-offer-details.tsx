import {
	useGetJobOfferQuery,
	useGetJobOffersQuery,
} from '@/app/services/jobOffers';
import { Building2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ApplyDialog from './apply-dialog';
import CompanyBanner from './company-banner';
import JobOfferDetailsSkeleton from './job-offer-details-skeleton';
import JobOfferHeader from './job-offer-header';
import JobOfferInfo from './job-offer-info';
import JobOfferTags from './job-offer-tags';

const JobOfferDetails = () => {
	const [searchParams] = useSearchParams();
	const joid = searchParams.get('joid');
	const { data: jobOffersData } = useGetJobOffersQuery({
		pageSize: 10,
		position: searchParams.get('position'),
	});
	const ref = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState<number>(0);
	const jobOfferId = joid ?? jobOffersData!.jobOffers[0].id;
	const { data, isLoading, isFetching, isUninitialized, isError } =
		useGetJobOfferQuery(jobOfferId);

	useEffect(() => {
		const handleScroll = () => {
			if (!ref.current) {
				return;
			}

			const rect = ref.current.getBoundingClientRect();
			setHeight(window.innerHeight - rect.y);
		};

		window.addEventListener('scroll', handleScroll);

		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	if (isLoading || isFetching || isUninitialized) {
		return <JobOfferDetailsSkeleton />;
	}

	if (isError) {
		return <div className="p-4">Couldn't load data</div>;
	}

	const {
		id,
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
		jobOfferSkills,
		jobOfferTechnologies,
	} = data.jobOffer;

	return (
		<div
			ref={ref}
			className="sticky top-[53px] min-h-[calc(100vh-254px)] p-4"
			style={{
				height,
			}}
		>
			<div className="border rounded-md h-full flex flex-col overflow-hidden">
				<CompanyBanner
					avatarUrl={company.avatarUrl}
					backgroundUrl={company.backgroundUrl}
				/>
				<div className="px-4 border-b">
					<JobOfferHeader
						createdAt={createdAt}
						position={position}
						salaryCurrency={salaryCurrency}
						salaryFrom={salaryFrom}
						salaryTo={salaryTo}
					/>
					<span className="inline-flex text-lg items-center mb-4">
						<Building2 className="w-5 h-5 mr-2" />
						{company.name}
					</span>
					<JobOfferInfo
						employmentType={employmentType}
						level={level}
						workType={workType}
					/>
					<JobOfferTags
						skills={jobOfferSkills}
						technologies={jobOfferTechnologies}
					/>
				</div>
				<div
					dangerouslySetInnerHTML={{
						__html: description,
					}}
					className="overflow-y-auto p-4 flex-1"
				></div>
				<div className="p-2 text-center border-t">
					<ApplyDialog
						position={position}
						jobOfferId={id}
						companyName={company.name}
					/>
				</div>
			</div>
		</div>
	);
};

export default JobOfferDetails;
