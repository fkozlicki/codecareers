import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import CompanyNavigationLinks from './company-navigation-links';

const CompanyMobileNavigation = () => {
	return (
		<div className="md:hidden">
			<Sheet>
				<SheetTrigger asChild>
					<Button size="icon" variant="outline" className="ml-4 mt-4">
						<Menu className="w-4 h-4" />
					</Button>
				</SheetTrigger>
				<SheetContent side="left">
					<div className="flex flex-col mt-4">
						<CompanyNavigationLinks />
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
};

export default CompanyMobileNavigation;
