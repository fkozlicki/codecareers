import { useLocation, useParams } from 'react-router-dom';
import NavigationLink from './navigation-link';

const CompanyNavigationLinks = () => {
	const { companyId } = useParams();
	const { pathname } = useLocation();

	return (
		<>
			<NavigationLink
				to={`/my-companies/${companyId}`}
				active={pathname === `/my-companies/${companyId}`}
			>
				General
			</NavigationLink>
			<NavigationLink
				to={`/my-companies/${companyId}/job-offers`}
				active={pathname.includes(`/my-companies/${companyId}/job-offers`)}
			>
				Job offers
			</NavigationLink>
			<NavigationLink
				to={`/my-companies/${companyId}/recruitments`}
				active={pathname.includes(`/my-companies/${companyId}/recruitments`)}
			>
				Recruitments
			</NavigationLink>
		</>
	);
};

export default CompanyNavigationLinks;
