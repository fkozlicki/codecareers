import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, Image } from 'lucide-react';

const JobOfferDetailsSkeleton = () => {
	return (
		<div
			className="min-h-[calc(100vh-254px)] p-4"
			data-testid="job-offer-details-skeleton"
		>
			<div className="border rounded-md h-full flex flex-col overflow-hidden">
				<AspectRatio ratio={6 / 1}>
					<div className="w-full h-full bg-muted grid place-items-center">
						<Image className="w-5 h-5 text-gray-500" />
					</div>
				</AspectRatio>
				<Avatar className="rounded -translate-y-1/2 ml-4 w-16 h-16 border">
					<AvatarImage />
					<AvatarFallback className="rounded">
						<Building2 className="w-4 h-4 text-gray-500" />
					</AvatarFallback>
				</Avatar>
				<div className="px-4 border-b">
					<Skeleton className="h-6 w-[400px] mb-2" />
					<Skeleton className="h-5 w-32 mb-4" />
					<Skeleton className="h-5 w-full mb-2" />
					<Skeleton className="h-5 w-full mb-2" />
				</div>
				<div className="overflow-y-auto p-4 flex-1">
					<Skeleton className="h-6 w-[400px] mb-2" />
					<Skeleton className="h-5 w-32 mb-4" />
					<Skeleton className="h-5 w-full mb-2" />
					<Skeleton className="h-5 w-full mb-2" />
					<Skeleton className="h-5 w-full mb-2" />
					<Skeleton className="h-5 w-full mb-2" />
				</div>
				<div className="p-2 grid place-items-center border-t">
					<Skeleton className="h-8 w-48" />
				</div>
			</div>
		</div>
	);
};

export default JobOfferDetailsSkeleton;
