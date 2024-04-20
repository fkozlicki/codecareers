import { JobOffer } from '@/app/services/jobOffers';
import { Separator } from '@/components/ui/separator';
import { InlineWidget } from 'react-calendly';

const RecruitmentJobOffer = ({ jobOffer }: { jobOffer: JobOffer }) => {
	const { description, company, position } = jobOffer;

	return (
		<div className="max-w-2xl m-auto">
			<h2>{company.name}</h2>
			<p>{company.description}</p>
			<span>{company.phoneNumber}</span>
			<Separator className="my-4" />
			<h2>{position}</h2>
			<div dangerouslySetInnerHTML={{ __html: description }} />
			<Separator className="my-4" />
			<div className="relative">
				<InlineWidget url="https://calendly.com/filip-kozlickii" />
			</div>
		</div>
	);
};

export default RecruitmentJobOffer;
