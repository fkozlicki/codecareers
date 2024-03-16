import { useAppSelector } from '@/app/hooks';
import { useUpdateUserMutation } from '@/app/services/users';
import ImageCropper from '@/components/image-cropper';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
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
import { Input } from '@/components/ui/input';
import { readFile } from '@/lib/cropImage';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	avatar: z.instanceof(Blob).optional(),
});

const Settings = () => {
	const { user } = useAppSelector((state) => state.auth);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: user?.firstName ?? '',
			lastName: user?.lastName ?? '',
		},
	});
	const [image, setImage] = useState<string | null>(null);
	const [cropperOpen, setCropperOpen] = useState<boolean>(false);
	const [updateUser] = useUpdateUserMutation();

	const avatar = form.watch('avatar');
	const avatarUrl = avatar ? URL.createObjectURL(avatar) : undefined;

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		updateUser({ id: user!.id, ...values })
			.unwrap()
			.then(() => {
				window.location.reload();
			});
	};

	return (
		<div className="py-8">
			<div className="max-w-xl m-auto">
				<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8 text-center">
					Hi, {user?.username || `${user?.firstName} ${user?.lastName}`}
				</h1>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit, console.log)}
						className="space-y-8"
					>
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>First name</FormLabel>
									<FormControl>
										<Input placeholder="John" {...field} />
									</FormControl>
									<FormDescription>
										This is your public first name.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Last name</FormLabel>
									<FormControl>
										<Input placeholder="Smith" {...field} />
									</FormControl>
									<FormDescription>
										This is your public last name.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex items-start gap-4">
							<Avatar>
								{user?.avatar && (
									<AvatarImage src={avatarUrl || user.avatar} alt="avatar" />
								)}
							</Avatar>
							<Dropzone
								className="flex-1"
								onChange={async (file) => {
									const imageUrl = await readFile(file);
									setImage(imageUrl as string);
									setCropperOpen(true);
								}}
								accept="image/*"
							/>
						</div>
						{image && (
							<Dialog
								open={cropperOpen}
								onOpenChange={(open) => {
									if (!open) {
										setImage(null);
									}
									setCropperOpen(open);
								}}
							>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Crop your avatar</DialogTitle>
										<DialogDescription>
											Make changes to your profile here. Click save when you're
											done.
										</DialogDescription>
									</DialogHeader>
									<ImageCropper
										image={image}
										setResult={(file) => {
											form.setValue('avatar', file);
											setCropperOpen(false);
										}}
									/>
								</DialogContent>
							</Dialog>
						)}
						<Button type="submit">Submit</Button>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default Settings;
