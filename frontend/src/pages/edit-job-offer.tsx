import { useGetJobOfferQuery } from '@/app/services/jobOffers';
import JobOfferForm from '@/components/job-offer-form';
import { useParams } from 'react-router-dom';

const EditJobOffer = () => {
	const { jobOfferId } = useParams();
	const { data } = useGetJobOfferQuery(jobOfferId!);

	if (!data) {
		return null;
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
