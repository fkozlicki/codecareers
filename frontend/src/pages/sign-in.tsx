import { useAppSelector } from '@/app/hooks';
import { useSignInMutation } from '@/app/services/auth';
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
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

const signInSchema = z.object({
	email: z.string().min(1, 'Email is required').email('Enter a valid email'),
	password: z.string().min(1, 'Password is required'),
});

type SignInValues = z.infer<typeof signInSchema>;

const SignIn = () => {
	const form = useForm<SignInValues>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});
	const { user } = useAppSelector((state) => state.auth);
	const [signIn] = useSignInMutation();
	const navigate = useNavigate();

	const onSubmit = (values: SignInValues) => {
		signIn(values)
			.unwrap()
			.then(() => {
				toast.success('Successfully signed in');
				form.reset();
				navigate('/');
			})
			.catch(() => {
				toast.error("Couldn't sign in");
			});
	};

	if (user) {
		return <Navigate to="/" />;
	}

	return (
		<div className="w-screen h-screen grid place-items-center">
			<div>
				<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">
					Sign In to CodeCarrers
				</h1>
				<div>
					<div className="flex flex-col gap-2">
						<a href="http://localhost:3000/login/github">
							<Button className="w-full">Sign In with Github</Button>
						</a>
						<a href="http://localhost:3000/login/google">
							<Button className="w-full">Sign In with Google</Button>
						</a>
					</div>
					<div className="flex items-center gap-4 my-4">
						<div className="flex-1 h-px bg-gray-200"></div>
						<span>OR</span>
						<div className="flex-1 h-px bg-gray-200"></div>
					</div>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
				<Link to="/">
					<Button variant="link" className="block m-auto mt-2">
						Back to Home
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default SignIn;
