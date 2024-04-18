import { Skeleton } from './ui/skeleton';

const MessagesSkeleton = () => {
	return (
		<div className="flex flex-col-reverse flex-1 gap-2">
			<Skeleton className="h-9 w-[200px] self-end" />
			<Skeleton className="h-9 w-[100px] self-end" />
			<Skeleton className="h-9 w-[200px]" />
			<Skeleton className="h-9 w-[300px]" />
			<div className="flex gap-2">
				<Skeleton className="h-9 w-9 rounded-full" />
				<Skeleton className="h-9 w-[120px]" />
			</div>
		</div>
	);
};

export default MessagesSkeleton;
