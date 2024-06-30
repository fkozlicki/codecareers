import { JobOffer, JobOfferDetailed } from '@/app/services/jobOffers';

const seniorReactDeveloper: JobOffer = {
	id: '123',
	company: {
		id: '444',
		avatarUrl: '',
		backgroundUrl: '',
		description: 'Making EV',
		name: 'Tesla',
		phoneNumber: '123-123-123',
	},
	createdAt: new Date().toISOString(),
	description: 'We are looking for passionate web developer',
	employmentType: 'b2b',
	level: 'senior',
	position: 'Senior React Developer',
	published: true,
	salaryCurrency: 'USD',
	salaryFrom: 12000,
	salaryTo: 15000,
	workType: 'full_time',
};

export const jobOffers: JobOffer[] = [seniorReactDeveloper];

export const seniorReactDeveloperDetailed: JobOfferDetailed = {
	...seniorReactDeveloper,
	jobOfferSkills: [
		{
			skill: {
				id: '222',
				name: 'React',
			},
		},
	],
	jobOfferTechnologies: [
		{
			technology: {
				id: '214',
				name: 'Typescript',
			},
		},
	],
};
