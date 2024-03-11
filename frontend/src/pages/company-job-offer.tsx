import {
	useGetJobOfferQuery,
	useUpdateJobOfferMutation,
} from '@/app/services/jobOffers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const CompanyJobOffer = () => {
	const { id, jobOfferId } = useParams();
	const { data } = useGetJobOfferQuery(jobOfferId!);
	const [updateJobOffer] = useUpdateJobOfferMutation();

	if (!data) {
		return null;
	}

	const { position, published } = data.jobOffer;

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
		<div>
			<div className="flex justify-between items-center">
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
		</div>
	);
};

export default CompanyJobOffer;
