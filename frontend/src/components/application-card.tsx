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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
	'pdfjs-dist/build/pdf.worker.min.js',
	import.meta.url
).toString();

const ApplicationCard = ({ application }: { application: Application }) => {
	const [updateApplication] = useUpdateApplicationMutation();
	const [open, setOpen] = useState<boolean>(false);
	const [numPages, setNumPages] = useState<number>();
	const [pageNumber, setPageNumber] = useState<number>(1);
	const options = useMemo(
		() => ({
			withCredentials: true,
		}),
		[]
	);

	const {
		id,
		cv,
		user: { firstName, lastName, username, avatar },
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
				setOpen(false);
			});
	};

	const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
		setNumPages(numPages);
	};

	const changePageNumber = (value: number) => {
		setPageNumber((prev) => prev + value);
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
						{cv && (
							<div className="flex gap-4 justify-center pt-4">
								<Button
									onClick={() => changePageNumber(-1)}
									disabled={pageNumber === 1}
									size="icon"
								>
									<ChevronLeft />
									<span className="sr-only">Previous page</span>
								</Button>
								<Button
									onClick={() => changePageNumber(1)}
									disabled={pageNumber === numPages}
									size="icon"
								>
									<ChevronRight />
									<span className="sr-only">Next page</span>
								</Button>
							</div>
						)}
						<div className="max-h-[50vh] overflow-y-scroll overflow-x-hidden">
							<Document
								file={`http://localhost:3000/cv/${cv}`}
								onLoadSuccess={onDocumentLoadSuccess}
								options={options}
							>
								<Page
									pageNumber={pageNumber}
									renderAnnotationLayer={false}
									renderTextLayer={false}
									scale={1}
								/>
							</Document>
						</div>
						<p className="text-center">
							Page {pageNumber} of {numPages}
						</p>
					</TabsContent>
				</Tabs>
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
