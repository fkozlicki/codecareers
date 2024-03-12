import { Application } from '@/app/services/applications';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ApplicationCard = ({ application }: { application: Application }) => {
	const {
		cv,
		user: { firstName, lastName, username },
	} = application;

	return (
		<Card className="p-4">
			<span>{username || `${firstName} ${lastName}`}</span>
			<div className="flex gap-2">{cv && <Badge>CV</Badge>}</div>
		</Card>
	);
};

export default ApplicationCard;
