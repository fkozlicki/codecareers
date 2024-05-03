import { Recruitment } from '@/app/services/companies';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface RecruitmentCardProps {
	recruitment: Recruitment;
}

const RecruitmentCard = ({ recruitment }: RecruitmentCardProps) => {
	const { companyId } = useParams();

	const { createdAt, open } = recruitment;
	const { position } = recruitment.jobOffer;
	const { avatar, username, firstName, lastName } = recruitment.user;

	return (
		<Link to={`/my-companies/${companyId}/recruitments/${recruitment.id}`}>
			<Card className="hover:shadow-md">
				<CardContent className="p-4">
					<div className="flex justify-between items-baseline">
						<span className="inline-block mb-4">{position}</span>
						<Badge
							variant={open ? 'outline' : 'destructive'}
							className={cn({ 'border-green-500 text-green-500': open })}
						>
							{open ? 'Open' : 'Closed'}
						</Badge>
					</div>
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-2">
							<Avatar>
								<AvatarFallback>
									<User size={16} />
								</AvatarFallback>
								<AvatarImage src={avatar ?? undefined} alt="user avatar" />
							</Avatar>
							<span>{username || `${firstName} ${lastName}`}</span>
						</div>
						<span className="text-sm text-muted-foreground">
							{dayjs(createdAt).fromNow()}
						</span>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
};

export default RecruitmentCard;
