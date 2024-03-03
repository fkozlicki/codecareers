import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

const NotFound = () => {
	const error = useRouteError() as Error;
	console.error(error);

	if (isRouteErrorResponse(error)) {
		return (
			<p>
				{error.status} {error.statusText}
			</p>
		);
	}

	return <p>{error.message || 'Unknown Error'}</p>;
};

export default NotFound;
