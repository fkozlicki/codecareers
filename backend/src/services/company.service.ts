import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { companies } from '../db/schema.js';
import {
	CreateCompanySchema,
	UpdateCompanySchema,
} from '../validators/companies.js';
import { generateId } from 'lucia';
import { uploadFileToS3 } from '../lib/s3.js';
import { MulterFiles } from '../lib/multer.js';

export const findCompanyById = async (id: string) => {
	return await db.query.companies.findFirst({
		where: eq(companies.id, id),
	});
};

export const findCompaniesByUserId = async (userId: string) => {
	return await db.query.companies.findMany({
		where: eq(companies.ownerId, userId),
		columns: {
			ownerId: false,
		},
	});
};

const uploadCompanyFiles = async (files: MulterFiles) => {
	let avatarFilename;
	let bannerFilename;

	const { avatar, banner } = files;

	try {
		if (avatar) {
			avatarFilename = generateId(15);
			await uploadFileToS3(`avatars/${avatarFilename}`, avatar[0].buffer);
		}
		if (banner) {
			bannerFilename = generateId(15);
			await uploadFileToS3(`avatars/${bannerFilename}`, banner[0].buffer);
		}

		return { avatarFilename, bannerFilename };
	} catch (error) {
		console.error(error);
		throw new Error('Could not upload company files');
	}
};

export const createCompany = async (
	ownerId: string,
	body: CreateCompanySchema['body'],
	files: {
		[fieldname: string]: Express.Multer.File[] | undefined;
	}
) => {
	let avatarUrl;
	let backgroundUrl;

	if (files) {
		const { avatarFilename, bannerFilename } = await uploadCompanyFiles(files);
		if (avatarFilename) {
			avatarUrl = `${process.env.API_URI}/avatars/${avatarFilename}`;
		}
		if (bannerFilename) {
			backgroundUrl = `${process.env.API_URI}/avatars/${bannerFilename}`;
		}
	}

	const [newCompany] = await db
		.insert(companies)
		.values({
			ownerId,
			avatarUrl,
			backgroundUrl,
			...body,
		})
		.returning();

	return newCompany;
};

export const updateCompany = async (
	id: string,
	body: UpdateCompanySchema['body'],
	files?: MulterFiles
) => {
	let avatar;
	let banner;

	if (files) {
		const { avatarFilename, bannerFilename } = await uploadCompanyFiles(files);
		avatar = avatarFilename;
		banner = bannerFilename;
	}

	const [updatedCompany] = await db
		.update(companies)
		.set({
			...body,
			...(avatar
				? { avatarUrl: `${process.env.API_URI}/avatars/${avatar}` }
				: {}),
			...(banner
				? { backgroundUrl: `${process.env.API_URI}/avatars/${banner}` }
				: {}),
		})
		.where(eq(companies.id, id))
		.returning();

	return updatedCompany;
};

export const deleteCompanyById = async (id: string) => {
	return (
		await db.delete(companies).where(eq(companies.id, id)).returning()
	)[0];
};
