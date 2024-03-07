import { useCreateCompanyMutation } from '@/app/services/companies';
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
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Loader } from 'lucide-react';

const formSchema = z.object({
	name: z.string().min(1),
	description: z.string(),
	phoneNumber: z
		.string()
		.regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/),
});

const CreateCompany = () => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			description: '',
			phoneNumber: '',
		},
	});
	const [createCompany, { isLoading }] = useCreateCompanyMutation();

	function onSubmit(values: z.infer<typeof formSchema>) {
		createCompany(values)
			.unwrap()
			.then(() => {
				form.reset();
				toast.success('Successfully created a company');
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
