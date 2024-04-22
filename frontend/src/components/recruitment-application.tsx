import { Application } from '@/app/services/applications';
import PDFViewer from './pdf-viewer';
import dayjs from 'dayjs';

const RecruitmentApplication = ({
	application,
}: {
	application: Application;
}) => {
	const { introduction, cv, createdAt } = application;

	return (
		<div className="max-w-2xl m-auto">
			<span>Sent {dayjs(createdAt).fromNow()}</span>
			<p className="mb-8">{introduction}</p>
			{cv && (
				<>
					<span className="inline-block">Your cv</span>
					<PDFViewer href={`${import.meta.env.VITE_API_URI}/cv/${cv}`} />
				</>
			)}
		</div>
	);
};

export default RecruitmentApplication;
