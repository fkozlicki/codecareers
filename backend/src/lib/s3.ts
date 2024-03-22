import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3';
import { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV ?? 'development'}` });

const s3Client = new S3Client({
	region: process.env.S3_REGION!,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
});

export async function uploadFileToS3(
	key: string,
	file: Express.Multer.File['buffer']
) {
	const result = await s3Client.send(
		new PutObjectCommand({
			Bucket: process.env.S3_BUCKET!,
			Key: key,
			Body: file,
			ContentType: 'application/pdf',
		})
	);

	return result;
}

export async function getFileFromS3(key: string) {
	const { Body } = await s3Client.send(
		new GetObjectCommand({
			Bucket: process.env.S3_BUCKET!,
			Key: key,
		})
	);

	return Body;
}

export const serveFile =
	(folderName: string) => async (req: Request, res: Response) => {
		const filename = req.params.filename;

		try {
			const Body = await getFileFromS3(`${folderName}/${filename}`);

			if (Body) {
				const buffer = await Body.transformToByteArray();
				res.send(Buffer.from(buffer));
			} else {
				res.send(404).send('File not found');
			}
		} catch (err) {
			console.error(err);
			res.status(500).send('Server error');
		}
	};
