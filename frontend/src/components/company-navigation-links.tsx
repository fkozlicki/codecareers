import { useLocation, useParams } from 'react-router-dom';
import NavigationLink from './navigation-link';

const CompanyNavigationLinks = () => {
	const { id } = useParams();
	const { pathname } = useLocation();

	return (
		<>
			<NavigationLink
				to={`/my-companies/${id}`}
				active={pathname === `/my-companies/${id}`}
			>
				General
			</NavigationLink>
			<NavigationLink
				to={`/my-companies/${id}/job-offers`}
				active={pathname.includes(`/my-companies/${id}/job-offers`)}
			>
				Job offers
			</NavigationLink>
			<NavigationLink
				to={`/my-companies/${id}/recruitments`}
				active={pathname.includes(`/my-companies/${id}/recruitments`)}
			>
				Recruitments
			</NavigationLink>
		</>
	);
};

export default CompanyNavigationLinks;
