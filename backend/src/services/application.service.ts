import { generateId } from 'lucia';
import {
	CreateApplicationSchema,
	GetJobOfferApplications,
} from '../validators/jobOffers';
import { uploadFileToS3 } from '../lib/s3';
import { db } from '../db/index';
import { and, eq, isNull } from 'drizzle-orm';
import { GetApplicationsSchema } from '../validators/applications';
import { Application, applications } from '../db/schema/application';
import { JobOffer } from '../db/schema/jobOffer';
import { Company } from '../db/schema/company';
import { User } from '../db/schema/user';

export const createApplication = async (
	jobOfferId: string,
	userId: string,
	body: CreateApplicationSchema['body'],
	file?: Express.Multer.File
) => {
	let cv;

	if (file) {
		cv = await uploadCV(file);
	}

	const [newApplication] = await db
		.insert(applications)
		.values({
			jobOfferId,
			userId,
			cv,
			...body,
		})
		.returning();

	return newApplication;
};

export const findApplicationsByUserId = async (
	userId: string,
	sort: GetApplicationsSchema['query']['sort']
) => {
	return await db.query.applications.findMany({
		where: and(
			eq(applications.userId, userId),
			sort
				? eq(applications.accepted, sort === 'accepted')
				: isNull(applications.accepted)
		),
		with: {
			jobOffer: {
				with: {
					company: {
						columns: {
							ownerId: false,
						},
					},
				},
				columns: {
					companyId: false,
				},
			},
		},
		columns: {
			userId: false,
			jobOfferId: false,
		},
	});
};

type ApplicationWithOwner = Application & {
	jobOffer: JobOffer & {
		company: Company & {
			owner: User;
		};
	};
};

export const findApplicationById = async <T extends boolean>(
	id: string,
	withOwner: T
) => {
	return (await db.query.applications.findFirst({
		where: eq(applications.id, id),
		with: withOwner
			? {
					jobOffer: {
						with: {
							company: {
								with: {
									owner: true,
								},
							},
						},
					},
			  }
			: undefined,
	})) as (T extends true ? ApplicationWithOwner : Application) | undefined;
};

export const updateApplication = async (id: string, accepted: boolean) => {
	const [updatedApplication] = await db
		.update(applications)
		.set({ accepted })
		.where(eq(applications.id, id))
		.returning();

	return updatedApplication;
};

export const findApplicationsByJobOfferId = async (
	jobOfferId: string,
	sort: GetJobOfferApplications['query']['sort']
) => {
	return await db.query.applications.findMany({
		where: and(
			eq(applications.jobOfferId, jobOfferId),
			sort
				? eq(applications.accepted, sort === 'accepted')
				: isNull(applications.accepted)
		),
		with: {
			user: {
				columns: {
					password: false,
				},
			},
		},
		columns: {
			userId: false,
		},
	});
};

const uploadCV = async (file: Express.Multer.File) => {
	const filename = generateId(15);

	try {
		await uploadFileToS3(`cvs/${filename}`, file.buffer);
	} catch (error) {
		console.error(error);
		throw new Error('Could not upload CV');
	}

	return filename;
};
