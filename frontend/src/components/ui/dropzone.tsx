import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChangeEvent, DragEvent, useRef, useState } from 'react';

interface DropzoneProps {
	onChange: (file: File) => void;
	className?: string;
	accept?: string;
}

export const Dropzone = ({
	onChange,
	className,
	accept,
	...props
}: DropzoneProps) => {
	const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference to file input element
	const [fileInfo, setFileInfo] = useState<string | null>(null); // Information about the uploaded file
	const [isOver, setIsOver] = useState<boolean>(false);

	// Function to handle drag over event
	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsOver(true);
	};

	// Function to handle drop event
	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		const { files } = e.dataTransfer;
		handleFiles(files);
		setIsOver(false);
	};

	// Function to handle file input change event
	const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		if (files) {
			handleFiles(files);
		}
		e.target.value = '';
	};

	// Function to handle processing of uploaded files
	const handleFiles = (files: FileList) => {
		const uploadedFile = files[0];

		const fileSizeInKB = Math.round(uploadedFile.size / 1024); // Convert to KB

		onChange(uploadedFile);

		// Display file information
		setFileInfo(`Uploaded file: ${uploadedFile.name} (${fileSizeInKB} KB)`);
	};

	// Function to simulate a click on the file input element
	const handleButtonClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<Card
			onClick={handleButtonClick}
			className={cn(
				'border-2 border-dashed bg-muted hover:cursor-pointer hover:border-muted-foreground/50',
				{ 'border-muted-foreground/50': isOver },
				className
			)}
			{...props}
		>
			<CardContent
				className="flex flex-col items-center justify-center space-y-2 px-2 py-4 text-xs"
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				onDragLeave={() => setIsOver(false)}
			>
				<div className="flex items-center justify-center text-muted-foreground">
					<span className="font-medium">
						{isOver ? 'Drop Here' : 'Drag Files or Click Here to Upload'}
					</span>
					<input
						ref={fileInputRef}
						type="file"
						accept={accept}
						onChange={handleFileInputChange}
						className="hidden"
					/>
				</div>
				{fileInfo && <p className="text-muted-foreground">{fileInfo}</p>}
			</CardContent>
		</Card>
	);
};
