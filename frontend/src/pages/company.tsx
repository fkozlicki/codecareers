import {
	useGetCompanyQuery,
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
import { Loader } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

const formSchema = z.object({
	name: z.string().min(1),
	description: z.string(),
	phoneNumber: z
		.string()
		.regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/),
});

const Company = () => {
	const { id } = useParams();
	const { data } = useGetCompanyQuery(id!);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			description: '',
			phoneNumber: '',
		},
	});
	const [updateCompany, { isLoading }] = useUpdateCompanyMutation();

	useEffect(() => {
		if (data) {
			form.reset(data.company);
		}
	}, [data]);

	function onSubmit(values: z.infer<typeof formSchema>) {
		if (data?.company) {
			updateCompany({ id: data.company.id, ...values });
		}
	}

	return (
		<div>
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
	);
};

export default Company;
