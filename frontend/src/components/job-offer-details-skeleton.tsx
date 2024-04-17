import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

const JobOfferDetailsSkeleton = () => {
	return (
		<div className="p-4 top-[53px] overflow-hidden">
			<div className="border rounded-md overflow-hidden h-full flex flex-col">
				<div>
					<AspectRatio
						ratio={6 / 1}
						className="overflow-hidden bg-muted"
					></AspectRatio>
					<Avatar className="rounded -translate-y-1/2 ml-4 w-16 h-16">
						<Skeleton className="w-full h-full bg-muted" />
					</Avatar>
				</div>
				<div className="px-4 border-b">
					<Skeleton className="h-4 mb-4 w-64" />
					<Skeleton className="h-4 mb-4 w-64" />
				</div>
				<div className="p-4 flex flex-col gap-8">
					<Skeleton className="h-4 mb-4 w-full" />
					<Skeleton className="h-6 mb-4 w-full" />
					<Skeleton className="h-6 mb-4 w-full" />
					<Skeleton className="h-6 mb-4 w-full" />
					<Skeleton className="h-4 w-full" />
				</div>
			</div>
		</div>
	);
};

export default JobOfferDetailsSkeleton;
