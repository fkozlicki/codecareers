import { useLocation, useParams } from 'react-router-dom';
import NavigationLink from './navigation-link';
import { Briefcase, Building2, FilePen } from 'lucide-react';

const CompanyNavigationLinks = () => {
	const { companyId } = useParams();
	const { pathname } = useLocation();

	return (
		<>
			<NavigationLink
				to={`/my-companies/${companyId}`}
				active={pathname === `/my-companies/${companyId}`}
			>
				<Building2 size={16} className="mr-2" />
				General
			</NavigationLink>
			<NavigationLink
				to={`/my-companies/${companyId}/job-offers`}
				active={pathname.includes(`/my-companies/${companyId}/job-offers`)}
			>
				<Briefcase size={16} className="mr-2" />
				Job offers
			</NavigationLink>
			<NavigationLink
				to={`/my-companies/${companyId}/recruitments`}
				active={pathname.includes(`/my-companies/${companyId}/recruitments`)}
			>
				<FilePen size={16} className="mr-2" />
				Recruitments
			</NavigationLink>
		</>
	);
};

export default CompanyNavigationLinks;
