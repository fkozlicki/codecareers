import { Recruitment } from '@/app/services/companies';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

interface RecruitmentCardProps {
	recruitment: Recruitment;
}

const RecruitmentCard = ({ recruitment }: RecruitmentCardProps) => {
	const { id } = useParams();

	return (
		<Link to={`/my-companies/${id}/recruitments/${recruitment.id}`}>
			<Card className="hover:shadow-md">
				<CardContent className="p-4">
					<span className="inline-block mb-4">
						{recruitment.jobOffer.position}
					</span>
					<div className="flex items-center gap-2">
						<Avatar>
							<AvatarFallback>
								<User size={16} />
							</AvatarFallback>
							<AvatarImage
								src={recruitment.user.avatar ?? undefined}
								alt="user avatar"
							/>
						</Avatar>
						<span>{recruitment.user.username}</span>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
};

export default RecruitmentCard;
