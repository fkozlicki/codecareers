interface CompanyHeaderProps {
	name: string;
	description: string;
}

const CompanyHeader = ({ name, description }: CompanyHeaderProps) => {
	return (
		<div className="px-4 py-8 sticky w-full top-[53px] bg-background border-b mb-4 z-10">
			<div className="max-w-4xl m-auto">
				<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
					{name}
				</h1>
				<h2>{description}</h2>
			</div>
		</div>
	);
};

export default CompanyHeader;
