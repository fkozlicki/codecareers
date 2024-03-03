import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';

const signUpSchema = z.object({
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
	email: z.string().min(1, 'Email is required').email('Enter a valid email'),
	password: z.string().min(1, 'Password is required'),
});

type SignUpValues = z.infer<typeof signUpSchema>;

const SignUp = () => {
	const form = useForm<SignUpValues>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
		},
	});

	const onSubmit = (values: SignUpValues) => {
		console.log(values);
	};

	return (
		<div className="w-screen h-screen grid place-items-center">
			<div>
				<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">
					Sign In to CodeCarrers
				</h1>
				<div>
					<div className="flex flex-col gap-2">
						<Button>Sign In with Github</Button>
						<Button>Sign In with Google</Button>
					</div>
					<div className="flex items-center gap-4 my-4">
						<div className="flex-1 h-px bg-gray-200"></div>
						<span>OR</span>
						<div className="flex-1 h-px bg-gray-200"></div>
					</div>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>First name</FormLabel>
										<FormControl>
											<Input placeholder="John" type="text" {...field} />
										</FormControl>
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
											<Input placeholder="Smith" type="text" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												placeholder="example@email.com"
												type="email"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input placeholder="•••••" type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full">
								Sign In
							</Button>
						</form>
					</Form>
				</div>
				<div className="text-center mt-4 text-sm">
					Back to{' '}
					<Link to="/" className="hover:underline">
						Home
					</Link>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
