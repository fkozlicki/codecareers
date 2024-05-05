import { JobOfferDetailed } from '@/app/services/jobOffers';
import CompanyBanner from '@/components/company-banner';
import JobOfferHeader from '@/components/job-offer-header';
import JobOfferInfo from '@/components/job-offer-info';
import JobOfferTags from '@/components/job-offer-tags';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { BriefcaseIcon, Building2, CalendarIcon } from 'lucide-react';
import { InlineWidget } from 'react-calendly';
dayjs.extend(utc);

const RecruitmentDetails = ({
	jobOffer,
	createdAt,
	open,
}: {
	jobOffer: JobOfferDetailed;
	createdAt: string;
	open: boolean;
}) => {
	const { description, company } = jobOffer;

	return (
		<div className="max-w-2xl m-auto">
			<div className="flex justify-between items-center mb-4">
				<Badge
					variant={open ? 'outline' : 'destructive'}
					className={cn({ 'border-green-500 text-green-500': open })}
				>
					{open ? 'Open' : 'Closed'}
				</Badge>
				<span>Started {dayjs(createdAt).fromNow()}</span>
			</div>
			<Separator className="my-4" />
			<h2 className="inline-flex items-center text-xl mb-4">
				<Building2 size={24} className="text-gray-500 mr-2" />
				Company
			</h2>
			<CompanyBanner
				avatarUrl={jobOffer.company.avatarUrl}
				backgroundUrl={jobOffer.company.backgroundUrl}
			/>
			<span>{company.name}</span>
			<p>{company.description}</p>
			<span>Phone: {company.phoneNumber}</span>
			<Separator className="my-4" />
			<h2 className="inline-flex items-center text-xl mb-4">
				<BriefcaseIcon size={24} className="text-gray-500 mr-2" />
				JobOffer
			</h2>
			<JobOfferHeader
				createdAt={jobOffer.createdAt}
				position={jobOffer.position}
				salaryCurrency={jobOffer.salaryCurrency}
				salaryFrom={jobOffer.salaryFrom}
				salaryTo={jobOffer.salaryTo}
			/>
			<JobOfferInfo
				employmentType={jobOffer.employmentType}
				level={jobOffer.level}
				workType={jobOffer.workType}
			/>
			<JobOfferTags
				skills={jobOffer.jobOfferSkills}
				technologies={jobOffer.jobOfferTechnologies}
			/>
			<div dangerouslySetInnerHTML={{ __html: description }} />
			<Separator className="my-4" />
			<h2 className="inline-flex items-center text-xl mb-4">
				<CalendarIcon size={24} className="text-gray-500 mr-2" />
				Pick interview date
			</h2>
			<div className="relative">
				<InlineWidget url="https://calendly.com/filip-kozlickii" />
			</div>
		</div>
	);
};

export default RecruitmentDetails;
