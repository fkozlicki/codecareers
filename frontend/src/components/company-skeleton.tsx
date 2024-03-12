import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const CompanySkeleton = () => {
	return (
		<Card className="p-4">
			<Skeleton className="h-4 w-24 mb-2" />
			<Skeleton className="h-4 w-32" />
		</Card>
	);
};

export default CompanySkeleton;
