import {
	CompanyValues,
	createCompanySchema,
	useCreateCompanyMutation,
} from '@/app/services/companies';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { readFile } from '@/lib/cropImage';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image, Loader } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CreateCompany = () => {
	const form = useForm<CompanyValues>({
		resolver: zodResolver(createCompanySchema),
		defaultValues: {
			name: '',
			description: '',
			phoneNumber: '',
		},
	});
	const [createCompany, { isLoading }] = useCreateCompanyMutation();
	const navigate = useNavigate();
	const [avatarPreview, setAvatarPreview] = useState<string>();
	const [bannerPreview, setBannerPreview] = useState<string>();

	function onSubmit(values: CompanyValues) {
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

	return (
		<div className="py-8">
			<div className="max-w-xl m-auto">
				<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8 text-center">
					Create company
				</h1>
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
												<div className="w-full h-full bg-muted flex justify-center items-center">
													<Image className="w-5 h-5 text-gray-500" />
													{bannerPreview && (
														<img
															src={bannerPreview}
															alt=""
															className="object-cover"
														/>
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
			</div>
		</div>
	);
};

export default CreateCompany;
