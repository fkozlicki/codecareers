import { Trash2Icon } from 'lucide-react';
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from './ui/tooltip';

const DeleteJobOfferDialog = () => {
	return (
		<AlertDialog>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<AlertDialogTrigger asChild>
							<Button variant="destructive" size="icon">
								<Trash2Icon size={16} />
								<span className="sr-only">Delete</span>
							</Button>
						</AlertDialogTrigger>
					</TooltipTrigger>
					<TooltipContent>
						<span>Delete</span>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your job
						offer and its recruitments and applications.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button variant="destructive">
						<Trash2Icon size={16} className="mr-2" />
						Delete
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteJobOfferDialog;
