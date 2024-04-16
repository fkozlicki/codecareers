import RecruitmentsList from '@/components/recruitments-list';

const Recruitments = () => {
	return (
		<div className="max-w-2xl m-auto py-8">
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-4xl text-center mb-4">
				Your recruitments
			</h1>
			<RecruitmentsList />
		</div>
	);
};

export default Recruitments;
