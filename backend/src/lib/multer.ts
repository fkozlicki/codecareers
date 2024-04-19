import multer from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({ storage });

export type MulterFiles = {
	[fieldname: string]: Express.Multer.File[] | undefined;
};
