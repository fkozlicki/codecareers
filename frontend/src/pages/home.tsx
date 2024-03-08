import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Home = () => {
	return (
		<div className="min-h-[calc(100vh-54px)] flex flex-col">
			<div className="py-8 border border-b border-t-0">
				<div className="max-w-2xl m-auto">
					<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8 text-center">
						CodeCareers
					</h1>
					<div className="flex items-center gap-4">
						<Input
							placeholder="Search for a job..."
							className="h-12 px-4 py-2 text-base"
						/>
						<Button className="h-12 px-8 text-base">Search</Button>
					</div>
				</div>
			</div>
			<div className="flex flex-1">
				<div className="flex-1 bg-red-400">asdasd</div>
				<div className="flex-1 bg-blue-400">asdasd</div>
			</div>
		</div>
	);
};

export default Home;
