import {
	Company,
	CompanyValues,
	createCompanySchema,
	useCreateCompanyMutation,
	useUpdateCompanyMutation,
} from '@/app/services/companies';
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
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image, Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Dropzone } from './ui/dropzone';
import { AspectRatio } from './ui/aspect-ratio';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { readFile } from '@/lib/cropImage';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface CompanyFormProps {
	initialData?: Company;
}

const CompanyForm = ({ initialData }: CompanyFormProps) => {
	const form = useForm<CompanyValues>({
		resolver: zodResolver(createCompanySchema),
		defaultValues: initialData ?? {
			name: '',
			description: '',
			phoneNumber: '',
		},
	});
	const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
		initialData?.avatarUrl ?? undefined
	);
	const [bannerPreview, setBannerPreview] = useState<string | undefined>(
		initialData?.backgroundUrl ?? undefined
	);
	const [updateCompany, { isLoading: updateLoading }] =
		useUpdateCompanyMutation();
	const [createCompany, { isLoading: createLoading }] =
		useCreateCompanyMutation();
	const navigate = useNavigate();

	const isLoading = updateLoading || createLoading;

	function onSubmit(values: CompanyValues) {
		if (initialData) {
			updateCompany({ id: initialData.id, ...values });
		} else {
			createCompany(values)
				.unwrap()
				.then(() => {
					form.reset();
					toast.success('Successfully created a company');
					navigate('/my-companies');
				})
				.catch(() => {
					toast.error('Could not create company');
				});
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					disabled={isLoading}
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input placeholder="Amazon" {...field} />
							</FormControl>
							<FormDescription>Your company name.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					disabled={isLoading}
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description (optional)</FormLabel>
							<FormControl>
								<Textarea
									placeholder="We are multinational corporation and technology company focusing on e-commerce, cloud computing, online advertising..."
									{...field}
								/>
							</FormControl>
							<FormDescription>Your company description.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					disabled={isLoading}
					control={form.control}
					name="phoneNumber"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Phone number</FormLabel>
							<FormControl>
								<Input placeholder="222-222-222" {...field} />
							</FormControl>
							<FormDescription>Your company phone number.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="avatar"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Avatar</FormLabel>
							<FormControl>
								<div className="flex items-center gap-4">
									<Avatar className="w-14 h-14">
										<AvatarImage src={avatarPreview} alt="avatar" />
										<AvatarFallback>
											<Image className="w-5 h-5 text-gray-500" />
										</AvatarFallback>
									</Avatar>
									<Dropzone
										className="flex-1"
										onChange={async (file) => {
											field.onChange(file);
											const image = (await readFile(file)) as string;
											setAvatarPreview(image);
										}}
										accept="image/*"
										withCrop
									/>
								</div>
							</FormControl>
							<FormDescription>This is your public avatar.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="banner"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Banner</FormLabel>
							<FormControl>
								<div className="flex flex-col gap-4">
									<Dropzone
										className="flex-1"
										onChange={async (file) => {
											field.onChange(file);
											const image = (await readFile(file)) as string;
											setBannerPreview(image);
										}}
										accept="image/*"
										withCrop
										cropAspect={6 / 1}
									/>
									<AspectRatio
										ratio={6 / 1}
										className="overflow-hidden rounded-lg"
									>
										<div className="w-full h-full bg-muted grid place-items-center">
											{bannerPreview ? (
												<img
													src={bannerPreview}
													alt=""
													className="object-cover w-full"
												/>
											) : (
												<Image className="w-5 h-5 text-gray-500" />
											)}
										</div>
									</AspectRatio>
								</div>
							</FormControl>
							<FormDescription>This is your public banner.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button disabled={isLoading} type="submit" className="w-full">
					{isLoading ? <Loader className="w-4 h-4 animate-spin" /> : 'Save'}
				</Button>
			</form>
		</Form>
	);
};

export default CompanyForm;
