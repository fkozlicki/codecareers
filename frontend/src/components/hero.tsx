import Search from '@/components/search';
import { Code } from 'lucide-react';

const Hero = () => {
	return (
		<div className="py-8 border-b border-t-0 px-4">
			<div className="max-w-2xl m-auto">
				<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-8 text-center inline-flex items-center w-full justify-center">
					<Code className="w-10 h-10 lg:w-14 lg:h-14 mr-2" strokeWidth={2.5} />
					CodeCareers
				</h1>
				<Search />
			</div>
		</div>
	);
};

export default Hero;
