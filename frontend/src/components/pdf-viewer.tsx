import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Document, Page } from 'react-pdf';
import { Button } from './ui/button';

interface PDFViewerProps {
	href: string;
}

const PDFViewer = ({ href }: PDFViewerProps) => {
	const [numPages, setNumPages] = useState<number>();
	const [pageNumber, setPageNumber] = useState<number>(1);
	const options = useMemo(
		() => ({
			withCredentials: true,
		}),
		[]
	);
	const [isLoading, setIsLoading] = useState(true);

	const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
		setNumPages(numPages);
		setIsLoading(false);
	};

	const changePageNumber = (value: number) => {
		setPageNumber((prev) => prev + value);
	};

	return (
		<>
			<div className="flex gap-4 justify-center pt-4">
				<Button
					onClick={() => changePageNumber(-1)}
					disabled={pageNumber === 1 || isLoading}
					size="icon"
				>
					<ChevronLeft />
					<span className="sr-only">Previous page</span>
				</Button>
				<Button
					onClick={() => changePageNumber(1)}
					disabled={pageNumber === numPages || isLoading}
					size="icon"
				>
					<ChevronRight />
					<span className="sr-only">Next page</span>
				</Button>
			</div>
			<Document
				file={href}
				onLoadSuccess={onDocumentLoadSuccess}
				options={options}
			>
				<Page
					pageNumber={pageNumber}
					renderAnnotationLayer={false}
					renderTextLayer={false}
					scale={1}
				/>
			</Document>
			<p className="text-center">
				Page {pageNumber} of {numPages}
			</p>
		</>
	);
};

export default PDFViewer;
