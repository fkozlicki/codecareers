import { useUpdateJobOfferMutation } from '@/app/services/jobOffers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CloudIcon, CloudOffIcon, EditIcon } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import DeleteJobOfferDialog from './delete-job-offer-dialog';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from './ui/tooltip';

interface JobOfferCTAProps {
	position: string;
	published: boolean;
}

const JobOfferCTA = ({ position, published }: JobOfferCTAProps) => {
	const { companyId, jobOfferId } = useParams();
	const [updateJobOffer] = useUpdateJobOfferMutation();

	const handleChangePublic = () => {
		if (!jobOfferId) {
			return;
		}

		updateJobOffer({
			id: jobOfferId,
			published: !published,
		})
			.unwrap()
			.then(() => {
				toast.success('Published successfully');
			});
	};

	return (
		<div className="flex justify-between items-center mb-8">
			<div className="flex items-center gap-4">
				<h2 className="text-3xl font-semibold tracking-tight">{position}</h2>
				<Badge
					variant="outline"
					className={cn({
						'border-green-300 text-green-600': published,
						'border-blue-300 text-blue-600': !published,
					})}
				>
					{published ? 'Public' : 'Draft'}
				</Badge>
			</div>
			<div className="flex gap-2">
				<Link to={`/my-companies/${companyId}/job-offers/${jobOfferId}/edit`}>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button size="icon">
									<EditIcon size={16} />
									<span className="sr-only">Edit</span>
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<span>Edit</span>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</Link>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button onClick={handleChangePublic} size="icon">
								{published ? (
									<CloudOffIcon size={16} />
								) : (
									<CloudIcon size={16} />
								)}
								<span className="sr-only">
									{published ? 'Unpublish' : 'Publish'}
								</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<span>{published ? 'Unpublish' : 'Publish'}</span>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				<DeleteJobOfferDialog />
			</div>
		</div>
	);
};

export default JobOfferCTA;
