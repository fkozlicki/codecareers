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
import { Building2 } from 'lucide-react';

dayjs.extend(relativeTime);

const JobOfferCard = ({
	jobOffer,
	admin,
	selected,
}: {
	jobOffer: JobOffer | JobOfferDetailed;
	selected?: boolean;
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
		company,
	} = jobOffer;

	return (
		<Card
			className={cn('p-4 hover:shadow-md', {
				'border-gray-500 shadow-md': selected,
			})}
		>
			<div className="flex items-center justify-between mb-2 flex-wrap gap-2">
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
			<span className="inline-flex items-center gap-2 text-sm mb-4 text-muted-foreground">
				<Building2 className="w-4 h-4" />
				{company.name}
			</span>
			<div className="flex justify-between items-center flex-wrap gap-2">
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
