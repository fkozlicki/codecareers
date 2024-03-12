import {
	ApplicationValues,
	createApplicationSchema,
	useCreateApplicationMutation,
	useGetJobOffersQuery,
	useLazyGetJobOfferQuery,
} from '@/app/services/jobOffers';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import { formatEmploymentType, formatWorkType } from '@/lib/format';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { Building2, FileText, History, Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const JobOfferDetails = () => {
	const [searchParams] = useSearchParams();
	const { data: jobOffersData } = useGetJobOffersQuery();
	const [queryJobOffer, { data, isLoading, isFetching }] =
		useLazyGetJobOfferQuery();
	const jobOfferId = searchParams.get('joid');
	const ref = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState<number>(0);
	const [createApplication] = useCreateApplicationMutation();
	const form = useForm<ApplicationValues>({
		resolver: zodResolver(createApplicationSchema),
		defaultValues: {
			introduction: '',
			cv: '',
		},
	});

	useEffect(() => {
		const handleScroll = () => {
			if (!ref.current) {
				return;
			}

			const rect = ref.current.getBoundingClientRect();
			setHeight(window.innerHeight - rect.y);
		};

		window.addEventListener('scroll', handleScroll);

		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	useEffect(() => {
		if (jobOfferId) {
			queryJobOffer(jobOfferId);
		} else if (jobOffersData && jobOffersData.jobOffers[0]) {
			queryJobOffer(jobOffersData.jobOffers[0].id);
		}
	}, [jobOfferId, queryJobOffer, jobOffersData]);

	const onSubmit = (values: ApplicationValues) => {
		if (!jobOfferId) {
			return;
		}
		createApplication({ id: jobOfferId, ...values })
			.unwrap()
			.then(() => toast.success('Successfully sent an application'))
			.catch(() => toast.warning("Couldn't sent an application"));
	};

	if (isLoading || isFetching) {
		return (
			<div className="p-4  top-[53px] min-h-[calc(100vh-246px)] overflow-hidden">
				<div className="border rounded-md overflow-hidden h-full flex flex-col">
					<div>
						<AspectRatio
							ratio={6 / 1}
							className="overflow-hidden bg-slate-300"
						></AspectRatio>
						<Avatar className="rounded -translate-y-1/2 ml-4 w-16 h-16">
							<Skeleton className="w-full h-full bg-primary/50" />
						</Avatar>
					</div>
					<div className="px-4 border-b">
						<Skeleton className="h-4 mb-4 w-64" />
						<Skeleton className="h-4 mb-4 w-64" />
					</div>
					<div className="p-4 flex flex-col gap-8">
						<Skeleton className="h-4 mb-4 w-full" />
						<Skeleton className="h-6 mb-4 w-full" />
						<Skeleton className="h-6 mb-4 w-full" />
						<Skeleton className="h-6 mb-4 w-full" />
						<Skeleton className="h-4 w-full" />
					</div>
				</div>
			</div>
		);
	}

	if (!data) {
		return null;
	}

	const {
		position,
		company,
		salaryFrom,
		salaryTo,
		salaryCurrency,
		level,
		employmentType,
		workType,
		createdAt,
		description,
		jobOfferSkills,
		jobOfferTechnologies,
	} = data.jobOffer;

	return (
		<div
			ref={ref}
			className="p-4 sticky top-[53px] min-h-[calc(100vh-246px)] overflow-hidden"
			style={{
				height,
			}}
		>
			<div className="border rounded-md overflow-hidden h-full flex flex-col">
				<div>
					<AspectRatio ratio={6 / 1} className="overflow-hidden">
						<img
							src="https://img.freepik.com/premium-vector/technology-global-blue-wide-banner-design-background-abstract-3d-banner-design-with-dark-blue-technology-geometric-background-vector-illustration_181182-27934.jpg?w=1380"
							alt=""
							className="object-cover"
						/>
					</AspectRatio>
					<Avatar className="rounded -translate-y-1/2 ml-4 w-16 h-16">
						<AvatarFallback className="rounded">AV</AvatarFallback>
					</Avatar>
				</div>
				<div className="px-4 border-b">
					<div className="flex justify-between items-center mb-2">
						<div className="flex gap-2 items-baseline">
							<h2 className="text-3xl font-semibold tracking-tight">
								{position}
							</h2>
							<span className="text-xl font-medium text-gray-700">
								{salaryFrom} - {salaryTo} {salaryCurrency.toUpperCase()}
							</span>
						</div>
						<span className="text-sm text-slate-600">
							{dayjs(createdAt).fromNow()}
						</span>
					</div>
					<span className="inline-flex text-lg items-center mb-4">
						<Building2 className="w-5 h-5 mr-2" />
						{company.name}
					</span>
					<div className="flex divide-x-2 mb-4">
						<span className="inline-flex items-center gap-2 pr-2">
							<History className="w-5 h-5" />
							{formatWorkType(workType)}
						</span>
						<span className="inline-flex items-center gap-2 px-2 capitalize">
							<Star className="w-5 h-5" />
							{level}
						</span>
						<span className="inline-flex items-center gap-2 pl-2">
							<FileText className="w-5 h-5" />
							{formatEmploymentType(employmentType)}
						</span>
					</div>
					<div className="flex gap-2 mb-4">
						<div className="flex-1">
							<div className="text-sm font-medium mb-2">Technologies</div>
							<div className="flex flex-wrap gap-2 items-start">
								{jobOfferTechnologies.map(({ technology }) => (
									<Badge key={technology.id}>{technology.name}</Badge>
								))}
							</div>
						</div>
						<div className="flex-1">
							<div className="text-sm font-medium mb-2">Skills</div>
							<div className="flex-1 flex flex-wrap gap-2 items-start">
								{jobOfferSkills.map(({ skill }) => (
									<Badge key={skill.id}>{skill.name}</Badge>
								))}
							</div>
						</div>
					</div>
				</div>
				<div
					dangerouslySetInnerHTML={{
						__html: description,
					}}
					className="overflow-y-auto p-4 overscroll-y-auto h-screen flex-1"
				></div>
				<div className="p-2 text-center border-t">
					<Dialog>
						<DialogTrigger asChild>
							<Button className="w-64">Apply now</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-2xl">
							<DialogHeader>
								<DialogTitle>Apply for {position}</DialogTitle>
								<DialogDescription>
									Introduce yourself to the employer
								</DialogDescription>
							</DialogHeader>
							<div className="">
								<Form {...form}>
									<form
										onSubmit={form.handleSubmit(onSubmit)}
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
															placeholder="Introduce yourself"
															{...field}
														/>
													</FormControl>
													<FormDescription>
														This is your public display name.
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
													<FormLabel>CV</FormLabel>
													<FormControl>
														<Dropzone
															onChange={field.onChange}
															fileExtension="pdf"
														/>
													</FormControl>
													<FormDescription>
														This is your public display name.
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
										<Button type="submit" className="w-full">
											Apply
										</Button>
									</form>
								</Form>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		</div>
	);
};

export default JobOfferDetails;
