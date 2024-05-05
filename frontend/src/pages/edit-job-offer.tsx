import { useGetJobOfferQuery } from '@/app/services/jobOffers';
import JobOfferForm from '@/components/job-offer-form';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Navigate, useParams } from 'react-router-dom';

const EditJobOffer = () => {
	const { jobOfferId } = useParams();
	const { data, isLoading, isUninitialized, isError, error } =
		useGetJobOfferQuery(jobOfferId!);

	if (isLoading || isUninitialized) {
		return <div>Loading...</div>;
	}

	if (isError) {
		if ((error as FetchBaseQueryError).status === 404) {
			return <Navigate to="/404" />;
		}

		return <div>Couldn't load data</div>;
	}

	return (
		<JobOfferForm
			defaultValues={{
				skills: data.jobOffer.jobOfferSkills.map(({ skill }) => ({
					label: skill.name,
					value: skill.id,
				})),
				technologies: data.jobOffer.jobOfferTechnologies.map(
					({ technology }) => ({
						label: technology.name,
						value: technology.id,
					})
				),
				...data.jobOffer,
			}}
		/>
	);
};

export default EditJobOffer;
