import { useAppSelector } from '@/app/hooks';
import { useUpdateUserMutation } from '@/app/services/users';
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
import { readFile } from '@/lib/cropImage';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'lucide-react';
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
	const [updateUser] = useUpdateUserMutation();
	const [preview, setPreview] = useState<string | null>(null);

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		updateUser({ id: user!.id, ...values })
			.unwrap()
			.then(() => {});
	};

	return (
		<div className="py-8 px-4">
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
						<FormField
							control={form.control}
							name="avatar"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Avatar</FormLabel>
									<FormControl>
										<div className="flex items-center gap-4">
											<Avatar className="w-14 h-14">
												{preview && <AvatarImage src={preview} alt="avatar" />}
												{user?.avatar && !preview && (
													<AvatarImage src={user.avatar} alt="avatar" />
												)}
												<AvatarFallback>
													<Image className="w-5 h-5 text-gray-500" />
												</AvatarFallback>
											</Avatar>
											<Dropzone
												className="flex-1"
												onChange={async (file) => {
													field.onChange(file);
													const image = (await readFile(file)) as string;
													setPreview(image);
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
						<Button type="submit" className="w-full">
							Save
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default Settings;
