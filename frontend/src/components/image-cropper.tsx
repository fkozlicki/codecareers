import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import getCroppedImg from '@/lib/cropImage';
import { useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';

interface ImageCropperProps {
	image: string;
	setResult: (file: File) => void;
}

const ImageCropper = ({ image, setResult }: ImageCropperProps) => {
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

	const onCropComplete = async (_: Area, croppedAreaPixels: Area) => {
		setCroppedAreaPixels(croppedAreaPixels);
	};

	const generateResult = async () => {
		if (!croppedAreaPixels) {
			return;
		}

		const croppedImage = (await getCroppedImg(
			image,
			croppedAreaPixels
		)) as File;

		setResult(croppedImage);
	};

	return (
		<>
			<div className="h-[400px] relative">
				<Cropper
					image={image}
					crop={crop}
					zoom={zoom}
					aspect={1}
					onCropChange={setCrop}
					onCropComplete={onCropComplete}
					onZoomChange={setZoom}
				/>
			</div>
			<div>
				<Slider
					value={[zoom]}
					min={1}
					max={3}
					step={0.1}
					onValueChange={(value) => setZoom(value[0])}
				/>
			</div>
			<div>
				<Button onClick={generateResult}>Save</Button>
			</div>
		</>
	);
};

export default ImageCropper;
