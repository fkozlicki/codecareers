import { useAppSelector } from '@/app/hooks';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
	firstName: z.string().min(1),
	lastName: z.string().min(1),
});

const Settings = () => {
	const { user } = useAppSelector((state) => state.auth);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
		},
	});
	const [step, setStep] = useState<'info' | 'images' | 'other'>('info');

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		console.log(values);
	};

	const changeStep = () => {
		if (step === 'info') {
			setStep('images');
		} else if (step === 'images') {
			setStep('other');
		}
	};

	return (
		<div className="py-8">
			<div className="max-w-xl m-auto">
				<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8 text-center">
					Hi, {user?.username}
				</h1>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
						{step === 'other' ? (
							<Button type="submit" className="w-full">
								Save
							</Button>
						) : (
							<Button onClick={changeStep}>Next</Button>
						)}
					</form>
				</Form>
			</div>
		</div>
	);
};

export default Settings;
