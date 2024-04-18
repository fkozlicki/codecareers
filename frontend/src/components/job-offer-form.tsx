import {
	JobOfferValues,
	createJobOfferSchema,
	useCreateJobOfferMutation,
} from '@/app/services/companies';
import { useGetSkillsQuery } from '@/app/services/skills';
import { useGetTechnologiesQuery } from '@/app/services/technologies';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import MultiSelect from '@/components/ui/multi-select';
import RichTextEditor from '@/components/ui/rich-text-editor';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const JobOfferForm = ({
	defaultValues,
}: {
	defaultValues?: JobOfferValues;
}) => {
	const { companyId } = useParams();
	const form = useForm<JobOfferValues>({
		resolver: zodResolver(createJobOfferSchema),
		defaultValues: defaultValues ?? {
			position: '',
			description: '',
			level: '',
			employmentType: '',
			workType: '',
			technologies: [],
			skills: [],
			salaryFrom: 0,
			salaryTo: 0,
			salaryCurrency: '',
		},
	});
	const [createJobOffer, { isLoading }] = useCreateJobOfferMutation();
	const { data: skillsData } = useGetSkillsQuery();
	const { data: techonologiesData } = useGetTechnologiesQuery();
	const navigate = useNavigate();

	const skills =
		skillsData?.skills?.map((skill) => ({
			label: skill.name,
			value: skill.id,
		})) ?? [];

	const technologies =
		techonologiesData?.technologies?.map((technology) => ({
			label: technology.name,
			value: technology.id,
		})) ?? [];

	const onSubmit = (values: JobOfferValues) => {
		if (!companyId) {
			return;
		}
		createJobOffer({ ...values, companyId })
			.unwrap()
			.then(() => {
				if (!defaultValues) {
					navigate(`/my-companies/${companyId}/job-offers`);
				}
				toast.success(
					`Successfuly ${defaultValues ? 'updated' : 'created'} company`
				);
			})
			.catch(() => {
				toast.success(
					`Couldn't ${defaultValues ? 'update' : 'create'} company`
				);
			});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-4">
				<FormField
					disabled={isLoading}
					control={form.control}
					name="position"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Position</FormLabel>
							<FormControl>
								<Input placeholder="DevOps Engineer" {...field} />
							</FormControl>
							<FormDescription>Position of your job offer.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex gap-4">
					<FormField
						disabled={isLoading}
						control={form.control}
						name="level"
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormLabel>Experience level</FormLabel>
								<FormControl>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<SelectTrigger>
											<SelectValue placeholder="Level" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="junior">Junior</SelectItem>
											<SelectItem value="mid">Mid</SelectItem>
											<SelectItem value="senior">Senior</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								<FormDescription>Position experience level.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						disabled={isLoading}
						control={form.control}
						name="employmentType"
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormLabel>Employment type</FormLabel>
								<FormControl>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<SelectTrigger>
											<SelectValue placeholder="Employment type" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="b2b">B2B</SelectItem>
											<SelectItem value="permanent">Permanent</SelectItem>
											<SelectItem value="internship">Internship</SelectItem>
											<SelectItem value="mandate">Mandate contract</SelectItem>
											<SelectItem value="task">Task contract</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								<FormDescription>Type of employment.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						disabled={isLoading}
						control={form.control}
						name="workType"
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormLabel>Work type</FormLabel>
								<FormControl>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<SelectTrigger>
											<SelectValue placeholder="Work type" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="full_time">Full-time</SelectItem>
											<SelectItem value="part_time">Part-time</SelectItem>
											<SelectItem value="internship">Internship</SelectItem>
											<SelectItem value="freelance">Freelance</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
								<FormDescription>Type of work.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex gap-4">
					<FormField
						disabled={isLoading}
						control={form.control}
						name="technologies"
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormLabel>Technologies</FormLabel>
								<FormControl>
									<MultiSelect
										defaultValue={defaultValues?.technologies}
										options={technologies}
										onChange={field.onChange}
									/>
								</FormControl>
								<FormDescription>Preffered technologies.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						disabled={isLoading}
						control={form.control}
						name="skills"
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormLabel>Skill</FormLabel>
								<FormControl>
									<MultiSelect
										defaultValue={defaultValues?.skills}
										options={skills}
										onChange={field.onChange}
									/>
								</FormControl>
								<FormDescription>Preffered skills.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<FormField
					disabled={isLoading}
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<RichTextEditor value={field.value} onChange={field.onChange} />
							</FormControl>
							<FormDescription>Your job offer description.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div>
					<div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2">
						Salary
					</div>
					<div className="flex gap-4">
						<FormField
							disabled={isLoading}
							control={form.control}
							name="salaryFrom"
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormLabel className="text-xs">From</FormLabel>
									<FormControl>
										<Input
											placeholder="Amazon"
											type="number"
											min={0}
											{...field}
										/>
									</FormControl>
									<FormDescription>Minimal salary.</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							disabled={isLoading}
							control={form.control}
							name="salaryTo"
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormLabel className="text-xs">To</FormLabel>
									<FormControl>
										<Input
											placeholder="Amazon"
											type="number"
											min={0}
											{...field}
										/>
									</FormControl>
									<FormDescription>Maximal salary.</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							disabled={isLoading}
							control={form.control}
							name="salaryCurrency"
							render={({ field }) => (
								<FormItem className="flex-1">
									<FormLabel className="text-xs">Currency</FormLabel>
									<FormControl>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<SelectTrigger>
												<SelectValue placeholder="Currency" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="pln">PLN</SelectItem>
												<SelectItem value="usd">USD</SelectItem>
												<SelectItem value="eur">EUR</SelectItem>
												<SelectItem value="gbp">GBP</SelectItem>
											</SelectContent>
										</Select>
									</FormControl>
									<FormDescription>Salary currency.</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>
				<Button disabled={isLoading} type="submit" className="w-full">
					{isLoading ? <Loader className="w-4 h-4 animate-spin" /> : 'Save'}
				</Button>
			</form>
		</Form>
	);
};

export default JobOfferForm;
