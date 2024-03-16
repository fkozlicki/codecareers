import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import getCroppedImg, { readFile } from '@/lib/cropImage';
import { cn } from '@/lib/utils';
import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';

interface DropzoneProps {
	onChange: (file: File) => void;
	className?: string;
	accept?: string;
	withCrop?: boolean;
	cropAspect?: number;
}

export const Dropzone = ({
	onChange,
	className,
	accept,
	withCrop,
	cropAspect,
	...props
}: DropzoneProps) => {
	const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference to file input element
	const [isOver, setIsOver] = useState<boolean>(false);
	const [imageToCrop, setImageToCrop] = useState<string | null>(null);
	const [fileName, setFileName] = useState<string | null>(null);
	const [fileSize, setFileSize] = useState<number | null>(null);

	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

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
	const handleFiles = async (files: FileList) => {
		const uploadedFile = files[0];

		setFileName(uploadedFile.name);

		if (withCrop) {
			const image = await readFile(uploadedFile);
			setImageToCrop(image as string);
			return;
		}

		const fileSizeInKB = Math.round(uploadedFile.size / 1024); // Convert to KB

		onChange(uploadedFile);

		// Display file information
		setFileSize(fileSizeInKB);
	};

	// Function to simulate a click on the file input element
	const handleButtonClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const afterCrop = (file: File) => {
		onChange(file);
		setImageToCrop(null);

		const fileSizeInKB = Math.round(file.size / 1024); // Convert to KB

		setFileSize(fileSizeInKB);
	};

	const onCropComplete = async (_: Area, croppedAreaPixels: Area) => {
		setCroppedAreaPixels(croppedAreaPixels);
	};

	const generateResult = async () => {
		if (!croppedAreaPixels || !imageToCrop) {
			return;
		}

		const croppedImage = (await getCroppedImg(
			imageToCrop,
			croppedAreaPixels
		)) as File;

		afterCrop(croppedImage);
	};

	return (
		<>
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
					{fileSize && fileName && (
						<p className="text-muted-foreground">
							Uploaded file: {fileName} ({fileSize} KB)
						</p>
					)}
				</CardContent>
			</Card>
			{withCrop && (
				<Dialog
					open={!!imageToCrop}
					onOpenChange={(open) => {
						if (!open) {
							setImageToCrop(null);
						}
					}}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Crop your avatar</DialogTitle>
							<DialogDescription>
								Make changes to your profile here. Click save when you're done.
							</DialogDescription>
						</DialogHeader>
						<Cropper
							classes={{
								containerClassName: '!relative h-[40vh]',
							}}
							image={imageToCrop!}
							crop={crop}
							zoom={zoom}
							aspect={cropAspect ?? 1 / 1}
							onCropChange={setCrop}
							onCropComplete={onCropComplete}
							onZoomChange={setZoom}
							showGrid={false}
						/>
						<Slider
							className="max-w-64 m-auto my-6"
							value={[zoom]}
							min={1}
							max={3}
							step={0.1}
							onValueChange={(value) => setZoom(value[0])}
						/>
						<DialogFooter className="justify-end">
							<DialogClose asChild>
								<Button type="button" variant="secondary">
									Close
								</Button>
							</DialogClose>
							<Button onClick={generateResult} type="button">
								Crop
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
};
