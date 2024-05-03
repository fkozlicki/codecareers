import { useCreateMessageMutation } from '@/app/services/chats';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form';
import { Input } from './ui/input';
import { SendHorizontal } from 'lucide-react';

const messageSchema = z.object({
	content: z.string().min(1),
});

type MessageValues = z.infer<typeof messageSchema>;

const ChatForm = ({ id }: { id: string }) => {
	const form = useForm<MessageValues>({
		resolver: zodResolver(messageSchema),
		defaultValues: {
			content: '',
		},
	});
	const [createMessage] = useCreateMessageMutation();

	function onSubmit({ content }: MessageValues) {
		createMessage({
			id,
			content,
		})
			.unwrap()
			.then(() => {
				form.reset();
			});
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex items-center w-full mt-4"
			>
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem className="space-y-0 w-full mr-4">
							<FormLabel className="sr-only">Content</FormLabel>
							<FormControl>
								<Input placeholder="Type your message..." {...field} />
							</FormControl>
						</FormItem>
					)}
				/>
				<Button type="submit">
					Send
					<SendHorizontal size={16} className="ml-2" />
				</Button>
			</form>
		</Form>
	);
};

export default ChatForm;
