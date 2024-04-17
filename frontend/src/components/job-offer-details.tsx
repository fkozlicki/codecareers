import {
	useGetJobOfferQuery,
	useGetJobOffersQuery,
} from '@/app/services/jobOffers';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
	formatCurrency,
	formatEmploymentType,
	formatWorkType,
} from '@/lib/format';
import dayjs from 'dayjs';
import { Building2, FileText, History, Image, Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ApplyDialog from './apply-dialog';
import JobOfferSkeleton from './job-offer-skeleton';

const JobOfferDetails = () => {
	const [searchParams] = useSearchParams();
	const name = searchParams.get('name');
	const joid = searchParams.get('joid');
	const { data: jobOffersData } = useGetJobOffersQuery({ pageSize: 10, name });
	const ref = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState<number>(0);
	const jobOfferId = joid ?? jobOffersData!.jobOffers[0].id;
	const { data, isLoading, isFetching, isUninitialized, isError } =
		useGetJobOfferQuery(jobOfferId);

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

	if (isLoading || isFetching || isUninitialized) {
		return <JobOfferSkeleton />;
	}

	if (isError) {
		return <div className="p-4">Couldn't load data</div>;
	}

	const {
		id,
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
			className="p-4 sticky top-[53px] min-h-[calc(100vh-254px)] "
			style={{
				height,
			}}
		>
			<div className="border rounded-md h-full flex flex-col">
				<AspectRatio ratio={6 / 1}>
					<div className="w-full h-full bg-muted grid place-items-center">
						{company.backgroundUrl ? (
							<img
								src={company.backgroundUrl}
								alt="company banner"
								className="object-cover w-full"
							/>
						) : (
							<Image className="w-5 h-5 text-gray-500" />
						)}
					</div>
				</AspectRatio>
				<Avatar className="rounded -translate-y-1/2 ml-4 w-16 h-16 border">
					<AvatarImage
						src={company.avatarUrl ?? undefined}
						alt="company avatar"
					/>
					<AvatarFallback className="rounded">
						<Building2 className="w-4 h-4 text-gray-500" />
					</AvatarFallback>
				</Avatar>
				<div className="px-4 border-b">
					<div className="flex justify-between items-center mb-2">
						<div className="flex gap-2 items-baseline">
							<h2 className="text-3xl font-semibold tracking-tight">
								{position}
							</h2>
							<span className="text-xl font-medium text-muted-foreground">
								{formatCurrency(salaryFrom)} - {formatCurrency(salaryTo)}{' '}
								{salaryCurrency.toUpperCase()}
							</span>
						</div>
						<span className="text-sm text-muted-foreground">
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
					className="overflow-y-auto p-4 flex-1"
				></div>
				<div className="p-2 text-center border-t">
					<ApplyDialog
						position={position}
						jobOfferId={id}
						companyName={company.name}
					/>
				</div>
			</div>
		</div>
	);
};

export default JobOfferDetails;
