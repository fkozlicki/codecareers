import { JobOfferDetailed } from '@/app/services/jobOffers';
import { Badge } from './ui/badge';

interface JobOfferTagsProps {
	technologies: JobOfferDetailed['jobOfferTechnologies'];
	skills: JobOfferDetailed['jobOfferSkills'];
}

const JobOfferTags = ({ skills, technologies }: JobOfferTagsProps) => {
	return (
		<div className="flex gap-2 mb-4">
			<div className="flex-1">
				<div className="text-sm font-medium mb-2">Technologies</div>
				<div className="flex flex-wrap gap-2 items-start">
					{technologies.map(({ technology }) => (
						<Badge key={technology.id}>{technology.name}</Badge>
					))}
				</div>
			</div>
			<div className="flex-1">
				<div className="text-sm font-medium mb-2">Skills</div>
				<div className="flex-1 flex flex-wrap gap-2 items-start">
					{skills.map(({ skill }) => (
						<Badge key={skill.id}>{skill.name}</Badge>
					))}
				</div>
			</div>
		</div>
	);
};

export default JobOfferTags;
