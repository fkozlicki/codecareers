import { useGetCompanyQuery } from '@/app/services/companies';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';

const CompanyLayout = () => {
	const { id } = useParams();
	const { pathname } = useLocation();

	const { data } = useGetCompanyQuery(id!);

	const navLinkClassNames = (primary: boolean) =>
		cn(
			'inline-flex items-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 justify-start',
			{
				'bg-primary text-primary-foreground hover:text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3 dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white justify-start':
					primary,
			}
		);

	return (
		<>
			<div className="md:hidden">
				<Sheet>
					<SheetTrigger asChild>
						<Button size="icon" variant="outline" className="mb-4">
							<Menu className="w-4 h-4" />
						</Button>
					</SheetTrigger>
					<SheetContent side="left">
						<div className="flex flex-col mt-4">
							<Link
								to={`/my-companies/${id}`}
								className={navLinkClassNames(
									pathname === `/my-companies/${id}`
								)}
							>
								General
							</Link>
							<Link
								to={`/my-companies/${id}/job-offers`}
								className={navLinkClassNames(
									pathname === `/my-companies/${id}/job-offers`
								)}
							>
								Job offers
							</Link>
							<Link
								to={`/my-companies/${id}/recruitments`}
								className={navLinkClassNames(
									pathname === `/my-companies/${id}/recruitments`
								)}
							>
								Recruitments
							</Link>
						</div>
					</SheetContent>
				</Sheet>
			</div>
			<div className="p-4 sticky w-full top-[53px] bg-background">
				<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
					{data?.company.name}
				</h1>
				<h2>{data?.company.description}</h2>
			</div>
			<div className="flex">
				<div className="h-[calc(100vh-173px)] flex-col w-72 hidden md:flex px-4 sticky top-[173px] self-start">
					<Link
						to={`/my-companies/${id}`}
						className={navLinkClassNames(pathname === `/my-companies/${id}`)}
					>
						General
					</Link>
					<Link
						to={`/my-companies/${id}/job-offers`}
						className={navLinkClassNames(
							pathname === `/my-companies/${id}/job-offers`
						)}
					>
						Job offers
					</Link>
					<Link
						to={`/my-companies/${id}/recruitments`}
						className={navLinkClassNames(
							pathname === `/my-companies/${id}/recruitments`
						)}
					>
						Recruitments
					</Link>
				</div>
				<div className="flex-1">
					<Outlet />
				</div>
			</div>
		</>
	);
};

export default CompanyLayout;
