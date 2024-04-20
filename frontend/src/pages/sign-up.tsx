import { useAppSelector } from '@/app/hooks';
import { useSignUpMutation } from '@/app/services/auth';
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
	const [signUp, { isLoading }] = useSignUpMutation();
	const { user } = useAppSelector((state) => state.auth);
	const navigate = useNavigate();

	const onSubmit = (values: SignUpValues) => {
		signUp(values)
			.unwrap()
			.then(() => {
				toast.success('Successfully signed up');
				form.reset();
				navigate('/signin');
			})
			.catch(() => {
				toast.error("Couldn't sign up");
			});
	};

	if (user) {
		return <Navigate to="/" />;
	}

	return (
		<div className="w-screen h-screen grid place-items-center">
			<div>
				<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8">
					Sign Up to CodeCarrers
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
						<div className="flex-1 h-px bg-secondary"></div>
						<span className="text-sm text-muted-foreground">OR</span>
						<div className="flex-1 h-px bg-secondary"></div>
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
											<Input
												placeholder="John"
												type="text"
												disabled={isLoading}
												{...field}
											/>
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
											<Input
												placeholder="Smith"
												type="text"
												disabled={isLoading}
												{...field}
											/>
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
												disabled={isLoading}
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
											<Input
												placeholder="•••••"
												type="password"
												disabled={isLoading}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" disabled={isLoading} className="w-full">
								Sign Up
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

export default SignUp;
