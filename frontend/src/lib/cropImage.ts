export function readFile(file: File) {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.addEventListener('load', () => resolve(reader.result), false);
		reader.readAsDataURL(file);
	});
}

export const createImage = (url: string) =>
	new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener('load', () => resolve(image));
		image.addEventListener('error', (error) => reject(error));
		image.src = url;
	});

interface Crop {
	x: number;
	y: number;
	width: number;
	height: number;
}

export default async function getCroppedImg(imageSrc: string, pixelCrop: Crop) {
	const image = (await createImage(imageSrc)) as HTMLImageElement;
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	if (!ctx) {
		return null;
	}

	// set canvas size to match the bounding box
	canvas.width = image.width;
	canvas.height = image.height;

	// draw rotated image
	ctx.drawImage(image, 0, 0);

	const croppedCanvas = document.createElement('canvas');

	const croppedCtx = croppedCanvas.getContext('2d');

	if (!croppedCtx) {
		return null;
	}

	// Set the size of the cropped canvas
	croppedCanvas.width = pixelCrop.width;
	croppedCanvas.height = pixelCrop.height;

	// Draw the cropped image onto the new canvas
	croppedCtx.drawImage(
		canvas,
		pixelCrop.x,
		pixelCrop.y,
		pixelCrop.width,
		pixelCrop.height,
		0,
		0,
		pixelCrop.width,
		pixelCrop.height
	);

	// As a blob
	return new Promise((resolve) => {
		croppedCanvas.toBlob((file) => {
			resolve(file);
		}, 'image/jpeg');
	});
}
