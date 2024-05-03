import { formatEmploymentType, formatWorkType } from '@/lib/format';
import { FileTextIcon, HistoryIcon, StarIcon } from 'lucide-react';

interface JobOfferInfoProps {
	workType: string;
	level: string;
	employmentType: string;
}

const JobOfferInfo = ({
	workType,
	employmentType,
	level,
}: JobOfferInfoProps) => {
	return (
		<div className="flex divide-x-2 mb-4">
			<span className="inline-flex items-center gap-2 pr-2">
				<HistoryIcon className="w-5 h-5" />
				{formatWorkType(workType)}
			</span>
			<span className="inline-flex items-center gap-2 px-2 capitalize">
				<StarIcon className="w-5 h-5" />
				{level}
			</span>
			<span className="inline-flex items-center gap-2 pl-2">
				<FileTextIcon className="w-5 h-5" />
				{formatEmploymentType(employmentType)}
			</span>
		</div>
	);
};

export default JobOfferInfo;
