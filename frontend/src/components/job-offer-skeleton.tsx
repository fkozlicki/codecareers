import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const JobOfferSkeleton = () => {
	return (
		<Card className="p-4" data-testid="job-offer-skeleton">
			<Skeleton className="h-4 mb-6" />
			<Skeleton className="h-4 max-w-[250px]" />
		</Card>
	);
};

export default JobOfferSkeleton;
