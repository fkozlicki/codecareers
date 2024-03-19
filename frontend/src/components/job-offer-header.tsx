import { useUpdateJobOfferMutation } from '@/app/services/jobOffers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';

interface JobOfferHeaderProps {
	position: string;
	published: boolean;
}

const JobOfferHeader = ({ position, published }: JobOfferHeaderProps) => {
	const { id, jobOfferId } = useParams();
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
				<Link to={`/my-companies/${id}/job-offers/${jobOfferId}/edit`}>
					<Button>Edit</Button>
				</Link>
				<Button onClick={handleChangePublic}>
					{published ? 'Unpublish' : 'Publish'}
				</Button>
			</div>
		</div>
	);
};

export default JobOfferHeader;
