import { Skeleton } from '@/components/ui/skeleton';

const CompanyFormSkeleton = () => {
	return (
		<div className="space-y-12">
			<div>
				<Skeleton className="h-4 mb-2 w-40" />
				<Skeleton className="h-9 w-full" />
			</div>
			<div>
				<Skeleton className="h-4 mb-2 w-40" />
				<Skeleton className="h-16 w-full" />
			</div>
			<div>
				<Skeleton className="h-4 mb-2 w-40" />
				<Skeleton className="h-9 w-full" />
			</div>
			<div>
				<Skeleton className="h-4 mb-2 w-40" />
				<Skeleton className="h-9 w-full" />
			</div>
			<div>
				<Skeleton className="h-4 mb-2 w-40" />
				<Skeleton className="h-9 w-full" />
			</div>
		</div>
	);
};

export default CompanyFormSkeleton;
