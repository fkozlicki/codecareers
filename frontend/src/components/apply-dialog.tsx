import {
	ApplicationValues,
	createApplicationSchema,
	useCreateApplicationMutation,
} from '@/app/services/jobOffers';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Dropzone } from '@/components/ui/dropzone';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const ApplyDialog = ({
	position,
	jobOfferId,
	companyName,
}: {
	position: string;
	jobOfferId: string;
	companyName: string;
}) => {
	const form = useForm<ApplicationValues>({
		resolver: zodResolver(createApplicationSchema),
		defaultValues: {
			introduction: '',
			cv: undefined,
		},
	});
	const [createApplication, { isLoading }] = useCreateApplicationMutation();
	const [open, setOpen] = useState<boolean>(false);

	const onSubmit = (values: ApplicationValues) => {
		if (!jobOfferId) {
			return;
		}

		createApplication({ id: jobOfferId, ...values })
			.unwrap()
			.then(() => {
				toast.success('Successfully sent an application');
				form.reset();
				setOpen(false);
			})
			.catch(() => toast.warning("Couldn't sent an application"));
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="w-64">Apply now</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Apply for {position}</DialogTitle>
					<DialogDescription>{companyName}</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						encType="multipart/form-data"
						className="space-y-8"
					>
						<FormField
							control={form.control}
							name="introduction"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Introduction</FormLabel>
									<FormControl>
										<Textarea
											disabled={isLoading}
											placeholder="Introduce yourself"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Introduce yourself or paste links to your socials.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="cv"
							render={({ field }) => (
								<FormItem>
									<FormLabel>CV (PDF only)</FormLabel>
									<FormControl>
										<Dropzone onChange={field.onChange} fileExtension="pdf" />
									</FormControl>
									<FormDescription>
										Paste your CV in PDF format.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button disabled={isLoading} type="submit" className="w-full">
							{isLoading ? (
								<Loader className="w-4 h-4 animate-spin" />
							) : (
								'Apply'
							)}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default ApplyDialog;
