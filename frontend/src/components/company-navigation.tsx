import CompanyNavigationLinks from './company-navigation-links';

const CompanyNavigation = () => {
	return (
		<div className="h-[calc(100vh-222px)] flex-col w-48 hidden md:flex pr-4 sticky top-[222px] self-start border-r mr-4">
			<CompanyNavigationLinks />
		</div>
	);
};

export default CompanyNavigation;
