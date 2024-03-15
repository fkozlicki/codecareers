import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	ChangeEvent,
	Dispatch,
	DragEvent,
	SetStateAction,
	useRef,
	useState,
} from 'react';

interface DropzoneProps {
	onChange: Dispatch<SetStateAction<File>>;
	className?: string;
	fileExtension?: string;
}

export const Dropzone = ({
	onChange,
	className,
	fileExtension,
	...props
}: DropzoneProps) => {
	const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference to file input element
	const [fileInfo, setFileInfo] = useState<string | null>(null); // Information about the uploaded file
	const [error, setError] = useState<string | null>(null); // Error message state

	// Function to handle drag over event
	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
	};

	// Function to handle drop event
	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		const { files } = e.dataTransfer;
		handleFiles(files);
	};

	// Function to handle file input change event
	const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		if (files) {
			handleFiles(files);
		}
	};

	// Function to handle processing of uploaded files
	const handleFiles = (files: FileList) => {
		const uploadedFile = files[0];

		// Check file extension
		if (fileExtension && !uploadedFile.name.endsWith(`.${fileExtension}`)) {
			setError(`Invalid file type. Expected: .${fileExtension}`);
			return;
		}

		const fileSizeInKB = Math.round(uploadedFile.size / 1024); // Convert to KB

		// const fileList = Array.from(files).map((file) => URL.createObjectURL(file));
		onChange(uploadedFile);

		// Display file information
		setFileInfo(`Uploaded file: ${uploadedFile.name} (${fileSizeInKB} KB)`);
		setError(null); // Reset error state
	};

	// Function to simulate a click on the file input element
	const handleButtonClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<Card
			className={`border-2 border-dashed bg-muted hover:cursor-pointer hover:border-muted-foreground/50 ${className}`}
			{...props}
		>
			<CardContent
				className="flex flex-col items-center justify-center space-y-2 px-2 py-4 text-xs"
				onDragOver={handleDragOver}
				onDrop={handleDrop}
			>
				<div className="flex items-center justify-center text-muted-foreground">
					<span className="font-medium">Drag Files to Upload or</span>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="ml-auto flex h-8 space-x-2 px-0 pl-1 text-xs"
						onClick={handleButtonClick}
					>
						Click Here
					</Button>
					<input
						ref={fileInputRef}
						type="file"
						accept={`.${fileExtension}`} // Set accepted file type
						onChange={handleFileInputChange}
						className="hidden"
						multiple
					/>
				</div>
				{fileInfo && <p className="text-muted-foreground">{fileInfo}</p>}
				{error && <span className="text-red-500">{error}</span>}
			</CardContent>
		</Card>
	);
};
