import { JobOffer, JobOfferDetailed } from '@/app/services/jobOffers';
import { Badge } from '@/components/ui/badge';
import { Card, CardTitle } from '@/components/ui/card';
import {
	formatCurrency,
	formatEmploymentType,
	formatWorkType,
} from '@/lib/format';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const JobOfferCard = ({
	jobOffer,
	admin,
}: {
	jobOffer: JobOffer | JobOfferDetailed;
	admin?: boolean;
}) => {
	const {
		position,
		salaryFrom,
		salaryTo,
		salaryCurrency,
		level,
		employmentType,
		workType,
		createdAt,
		published,
	} = jobOffer;

	return (
		<Card className="p-4 hover:shadow-md">
			<div className="flex items-center justify-between mb-4">
				<div className="flex gap-2 items-center">
					<CardTitle>{position}</CardTitle>
					{admin && (
						<Badge
							variant="outline"
							className={cn({
								'border-green-300 text-green-600': published,
								'border-blue-300 text-blue-600': !published,
							})}
						>
							{published ? 'Public' : 'Draft'}
						</Badge>
					)}
				</div>
				<span>
					{formatCurrency(salaryFrom)} - {formatCurrency(salaryTo)}{' '}
					{salaryCurrency.toUpperCase()}
				</span>
			</div>
			<div className="flex justify-between items-center">
				<div className="flex gap-2">
					<Badge variant="outline" className="capitalize">
						{level}
					</Badge>
					<Badge variant="outline">{formatWorkType(workType)}</Badge>
					<Badge variant="outline">
						{formatEmploymentType(employmentType)}
					</Badge>
				</div>
				<span className="text-xs opacity-50">{dayjs(createdAt).fromNow()}</span>
			</div>
		</Card>
	);
};

export default JobOfferCard;
