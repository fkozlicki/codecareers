import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from './ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

const searchSchema = z.object({
	name: z.string(),
});

type SearchValues = z.infer<typeof searchSchema>;

const Search = () => {
	const form = useForm<SearchValues>({
		resolver: zodResolver(searchSchema),
		defaultValues: {
			name: '',
		},
	});
	const [, setSearchParams] = useSearchParams();

	function onSubmit(values: SearchValues) {
		if (values.name) {
			setSearchParams(values);
		} else {
			setSearchParams();
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex items-center gap-4"
			>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem className="flex-1">
							<FormControl>
								<Input
									placeholder="Search for a job..."
									className="h-12 px-4 py-2 text-base"
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<Button className="h-12 px-8 text-base" type="submit">
					Submit
				</Button>
			</form>
		</Form>
	);
};

export default Search;
