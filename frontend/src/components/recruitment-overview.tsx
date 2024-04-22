import { useGetRecruitmentQuery } from '@/app/services/recruitments';
import { User } from 'lucide-react';
import { useParams } from 'react-router-dom';
import PDFViewer from './pdf-viewer';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
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

	const { user, jobOffer, cv } = data.recruitment.application;

	return (
		<div>
			<div className="flex items-center gap-2">
				<Avatar>
					<AvatarFallback>
						<User size={16} />
					</AvatarFallback>
					<AvatarImage src={user.avatar ?? undefined} alt="user avatar" />
				</Avatar>
				<span>{user.username}</span>
			</div>
			<span>Applying for {jobOffer.position}</span>
			<PDFViewer href={`${import.meta.env.VITE_API_URI}/cv/${cv}`} />
		</div>
	);
};

export default RecruitmentOverview;
