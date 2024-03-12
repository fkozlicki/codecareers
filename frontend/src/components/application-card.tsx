import {
	Application,
	useUpdateApplicationMutation,
} from '@/app/services/applications';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import dayjs from 'dayjs';
import { useState } from 'react';

const ApplicationCard = ({ application }: { application: Application }) => {
	const [updateApplication] = useUpdateApplicationMutation();
	const [open, setOpen] = useState<boolean>(false);

	const {
		id,
		cv,
		user: { firstName, lastName, username },
		introduction,
		createdAt,
		accepted,
	} = application;

	const handleDecision = (accepted: boolean) => {
		updateApplication({
			id,
			accepted,
		})
			.unwrap()
			.then(() => {
				// close dialog
				setOpen(false);
			});
	};

	return (
		<Dialog open={open} onOpenChange={(open) => setOpen(open)}>
			<DialogTrigger asChild>
				<Card className="p-4 hover:shadow-md cursor-pointer">
					<div className="flex justify-between items-center">
						<div>
							<div className="flex items-center gap-4 mb-2">
								<span>{username || `${firstName} ${lastName}`}</span>
								<div className="flex gap-2">{cv && <Badge>CV</Badge>}</div>
							</div>
							<span className="text-sm text-slate-500">
								{dayjs(createdAt).fromNow()}
							</span>
						</div>
						<Button>Show</Button>
					</div>
				</Card>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<div className="flex items-center gap-3">
						<Avatar>
							<img src="" alt="" />
							<AvatarFallback>EL</AvatarFallback>
						</Avatar>
						<span>{username || `${firstName} ${lastName}`}</span>
					</div>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<p>{introduction}</p>
				</div>
				{accepted === null && (
					<DialogFooter>
						<Button
							onClick={() => handleDecision(true)}
							className="flex-1 bg-green-600 hover:bg-green-500"
						>
							Accept
						</Button>
						<Button
							onClick={() => handleDecision(false)}
							variant="destructive"
							className="flex-1"
						>
							Reject
						</Button>
					</DialogFooter>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default ApplicationCard;
