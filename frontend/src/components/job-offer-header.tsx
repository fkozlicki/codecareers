import { formatCurrency } from '@/lib/format';
import dayjs from 'dayjs';

interface JobOfferHeaderProps {
	position: string;
	salaryFrom: number;
	salaryTo: number;
	salaryCurrency: string;
	createdAt: string;
}

const JobOfferHeader = ({
	position,
	createdAt,
	salaryCurrency,
	salaryFrom,
	salaryTo,
}: JobOfferHeaderProps) => {
	return (
		<div className="flex justify-between items-center mb-2 flex-wrap">
			<div className="flex items-baseline flex-wrap gap-x-4">
				<h2 className="text-3xl font-semibold tracking-tight">{position}</h2>
				<span className="text-xl font-medium text-muted-foreground">
					{formatCurrency(salaryFrom)} - {formatCurrency(salaryTo)}{' '}
					{salaryCurrency.toUpperCase()}
				</span>
			</div>
			<span className="text-sm text-muted-foreground">
				{dayjs(createdAt).fromNow()}
			</span>
		</div>
	);
};

export default JobOfferHeader;
