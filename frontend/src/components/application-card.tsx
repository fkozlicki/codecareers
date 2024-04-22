import {
	Application,
	useAcceptApplicationMutation,
	useRejectApplicationMutation,
} from '@/app/services/applications';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import dayjs from 'dayjs';
import { Loader } from 'lucide-react';
import { useState } from 'react';
import { pdfjs } from 'react-pdf';
import PDFViewer from './pdf-viewer';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.js',
	import.meta.url
).toString();

const ApplicationCard = ({ application }: { application: Application }) => {
	const [open, setOpen] = useState<boolean>(false);
	const [acceptApplication, acceptState] = useAcceptApplicationMutation();
	const [rejectApplication, rejectState] = useRejectApplicationMutation();

	const {
		id,
		cv,
		user: { firstName, lastName, username, avatar },
		introduction,
		createdAt,
		accepted,
	} = application;

	const handleAccept = () => {
		acceptApplication(id)
			.unwrap()
			.then(() => {
				setOpen(false);
			});
	};

	const handleReject = () => {
		rejectApplication(id)
			.unwrap()
			.then(() => {
				setOpen(false);
			});
	};

	const isLoading = acceptState.isLoading || rejectState.isLoading;

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
			<DialogContent className="md:max-w-3xl">
				<Tabs defaultValue="preview">
					<DialogHeader>
						<TabsList className="grid w-full grid-cols-2 max-w-xs m-auto">
							<TabsTrigger value="preview">Preview</TabsTrigger>
							<TabsTrigger disabled={!cv} value="cv">
								CV
							</TabsTrigger>
						</TabsList>
					</DialogHeader>
					<TabsContent value="preview">
						<div className="grid gap-4 py-4">
							<div className="flex items-center gap-3">
								<Avatar>
									{avatar && <AvatarImage src={avatar} alt="user avatar" />}
									<AvatarFallback>
										{firstName?.at(0)}
										{lastName?.at(0)}
									</AvatarFallback>
								</Avatar>
								<span>{username || `${firstName} ${lastName}`}</span>
							</div>
							<p>{introduction}</p>
						</div>
					</TabsContent>
					<TabsContent value="cv">
						<PDFViewer href={`${import.meta.env.VITE_API_URI}/cv/${cv}`} />
					</TabsContent>
				</Tabs>
				{accepted === null && (
					<DialogFooter>
						<Button
							disabled={isLoading}
							onClick={handleAccept}
							className="flex-1 bg-green-600 hover:bg-green-500"
						>
							{isLoading ? (
								<Loader className="w-4 h-4 animate-spin" />
							) : (
								'Accept'
							)}
						</Button>
						<Button
							disabled={isLoading}
							onClick={handleReject}
							variant="destructive"
							className="flex-1"
						>
							{isLoading ? (
								<Loader className="w-4 h-4 animate-spin" />
							) : (
								'Reject'
							)}
						</Button>
					</DialogFooter>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default ApplicationCard;
