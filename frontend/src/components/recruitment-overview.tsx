import { useGetRecruitmentQuery } from '@/app/services/recruitments';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { FilePenIcon, FileTextIcon, User, UserIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';
import PDFViewer from './pdf-viewer';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Skeleton } from './ui/skeleton';

const RecruitmentOverview = () => {
	const { recruitmentId } = useParams();
	const { data, isLoading, isUninitialized, isError } = useGetRecruitmentQuery(
		recruitmentId!
	);

	if (isLoading || isUninitialized) {
		return (
			<div>
				<Skeleton className="h-4 w-64 mb-3" />
				<Skeleton className="h-4 w-full mb-3" />
				<Skeleton className="h-8 w-full mb-3" />
				<Skeleton className="h-12 w-full" />
			</div>
		);
	}

	if (isError) {
		return <div>Couldn't load data</div>;
	}

	const { createdAt, open } = data.recruitment;
	const { user, jobOffer, cv, introduction } = data.recruitment.application;

	return (
		<div>
			<h2 className="inline-flex items-center text-xl mb-4">
				{jobOffer.position}
			</h2>
			<div className="flex justify-between items-center mb-4">
				<Badge
					variant={open ? 'outline' : 'destructive'}
					className={cn({ 'border-green-500 text-green-500': open })}
				>
					{open ? 'Open' : 'Closed'}
				</Badge>
				<span>Started {dayjs(createdAt).fromNow()}</span>
			</div>
			<Separator className="my-4" />
			<h2 className="inline-flex items-center text-xl mb-4 w-full">
				<UserIcon size={24} className="text-gray-500 mr-2" />
				User
			</h2>
			<div className="flex items-center gap-2">
				<Avatar>
					<AvatarFallback>
						<User size={16} />
					</AvatarFallback>
					<AvatarImage src={user.avatar ?? undefined} alt="user avatar" />
				</Avatar>
				<span>{user.username}</span>
			</div>
			<Separator className="my-4" />
			<h2 className="inline-flex items-center text-xl mb-4">
				<FilePenIcon size={24} className="text-gray-500 mr-2" />
				Introduction
			</h2>
			<p>{introduction}</p>
			<Separator className="my-4" />
			<h2 className="inline-flex items-center text-xl mb-4">
				<FileTextIcon size={24} className="text-gray-500 mr-2" />
				CV
			</h2>
			<PDFViewer href={`${import.meta.env.VITE_API_URI}/cv/${cv}`} />
		</div>
	);
};

export default RecruitmentOverview;
