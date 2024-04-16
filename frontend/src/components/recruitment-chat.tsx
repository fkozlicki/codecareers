import { useCreateMessageMutation } from '@/app/services/chats';
import { socket } from '@/lib/socket';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ChatMessages from './chat-messages';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form';
import { Input } from './ui/input';

const messageSchema = z.object({
	content: z.string().min(1),
});

type MessageValues = z.infer<typeof messageSchema>;

const RecruitmentChat = ({ id }: { id: string }) => {
	const form = useForm<MessageValues>({
		resolver: zodResolver(messageSchema),
		defaultValues: {
			content: '',
		},
	});
	const [createMessage] = useCreateMessageMutation();

	useEffect(() => {
		socket.connect();

		socket.emit('join_room', `chat-${id}`);

		return () => {
			socket.disconnect();
		};
	}, []);

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
		<div className="h-full flex flex-col gap-4">
			<ChatMessages id={id} />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex items-center w-full"
				>
					<FormField
						control={form.control}
						name="content"
						render={({ field }) => (
							<FormItem className="space-y-0 w-full mr-4">
								<FormLabel className="sr-only">Content</FormLabel>
								<FormControl>
									<Input placeholder="shadcn" {...field} />
								</FormControl>
							</FormItem>
						)}
					/>
					<Button type="submit">Submit</Button>
				</form>
			</Form>
		</div>
	);
};

export default RecruitmentChat;
