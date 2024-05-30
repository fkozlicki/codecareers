import { LoaderIcon, Trash2Icon } from 'lucide-react';
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
import { useDeleteJobOfferMutation } from '@/app/services/jobOffers';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const DeleteJobOfferDialog = () => {
	const { companyId, jobOfferId } = useParams();
	const [deleteJobOffer, { isLoading }] = useDeleteJobOfferMutation();
	const navigate = useNavigate();

	const onDelete = () => {
		deleteJobOffer(jobOfferId!)
			.unwrap()
			.then(() => {
				toast.success('Successfully deleted job offer');
				navigate(`/my-companies/${companyId}/job-offers`);
			})
			.catch(() => {
				toast.error("Couldn't delete job offer");
			});
	};

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
					<Button variant="destructive" disabled={isLoading} onClick={onDelete}>
						{isLoading ? (
							<LoaderIcon size={16} className="animate-spin" />
						) : (
							<>
								<Trash2Icon size={16} className="mr-2" />
								Delete
							</>
						)}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteJobOfferDialog;
