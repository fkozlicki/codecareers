import { JobOffer } from '@/app/services/jobOffers';
import { Badge } from '@/components/ui/badge';
import { Card, CardTitle } from '@/components/ui/card';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const JobOfferCard = ({ jobOffer }: { jobOffer: JobOffer }) => {
	const {
		position,
		salaryFrom,
		salaryTo,
		salaryCurrency,
		level,
		employmentType,
		workType,
		createdAt,
	} = jobOffer;

	return (
		<Card className="p-4 hover:shadow-md">
			<div className="flex items-center justify-between mb-4">
				<CardTitle>{position}</CardTitle>
				<span>
					{salaryFrom} - {salaryTo} {salaryCurrency}
				</span>
			</div>
			<div className="flex justify-between items-center">
				<div className="flex gap-2">
					<Badge variant="outline">{level}</Badge>
					<Badge variant="outline">{workType}</Badge>
					<Badge variant="outline">{employmentType}</Badge>
				</div>
				<span className="text-xs opacity-50">{dayjs(createdAt).fromNow()}</span>
			</div>
		</Card>
	);
};

export default JobOfferCard;
