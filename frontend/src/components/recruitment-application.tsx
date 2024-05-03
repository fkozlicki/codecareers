import { Application } from '@/app/services/applications';
import PDFViewer from './pdf-viewer';
import dayjs from 'dayjs';
import { FilePenIcon, FileTextIcon } from 'lucide-react';
import { Separator } from './ui/separator';

const RecruitmentApplication = ({
	application,
}: {
	application: Application;
}) => {
	const { introduction, cv, createdAt } = application;

	return (
		<div className="max-w-2xl m-auto">
			<div className="flex justify-end mb-2">
				<span className="text-sm text-muted-foreground">
					Created {dayjs(createdAt).fromNow()}
				</span>
			</div>
			<Separator className="my-4" />
			<h2 className="inline-flex items-center text-xl mb-4">
				<FilePenIcon size={24} className="text-gray-500 mr-2" />
				Introduction
			</h2>
			<p className="mb-8">{introduction}</p>
			<Separator className="my-4" />
			<h2 className="inline-flex items-center text-xl mb-4">
				<FileTextIcon size={24} className="text-gray-500 mr-2" />
				CV
			</h2>
			{cv && <PDFViewer href={`${import.meta.env.VITE_API_URI}/cv/${cv}`} />}
		</div>
	);
};

export default RecruitmentApplication;
