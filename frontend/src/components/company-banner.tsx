import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { Building2Icon, ImageIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface CompanyBannerProps {
	backgroundUrl: string | null;
	avatarUrl: string | null;
}

const CompanyBanner = ({ backgroundUrl, avatarUrl }: CompanyBannerProps) => {
	return (
		<>
			<AspectRatio ratio={6 / 1}>
				{backgroundUrl ? (
					<img
						src={backgroundUrl}
						alt="company banner"
						className="object-cover w-full"
					/>
				) : (
					<div className="w-full h-full bg-muted grid place-items-center">
						<ImageIcon className="w-5 h-5 text-gray-500" />
					</div>
				)}
			</AspectRatio>
			<Avatar className="rounded -translate-y-1/2 ml-4 w-16 h-16 border">
				<AvatarImage src={avatarUrl ?? undefined} alt="company avatar" />
				<AvatarFallback className="rounded">
					<Building2Icon className="w-4 h-4 text-gray-500" />
				</AvatarFallback>
			</Avatar>
		</>
	);
};

export default CompanyBanner;
