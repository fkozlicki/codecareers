import { sql } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';
import {
	applications,
	chatUsers,
	chats,
	companies,
	jobOffers,
	messages,
	recruitments,
	skills,
	technologies,
	users,
} from '../db/schema/index.js';
import { db } from '../db/index.js';

export const password = 'S3cReT123';

export const initializeDB = async () => {
	const hashedPassword = await new Argon2id().hash(password);
	const [adam] = await db
		.insert(users)
		.values({
			firstName: 'Adam',
			lastName: 'Joseph',
			email: 'adam.jospeh@gmail.com',
			password: hashedPassword,
		})
		.returning();

	const [jon] = await db
		.insert(users)
		.values({
			firstName: 'Jon',
			lastName: 'Snow',
			email: 'jon.snow@gmail.com',
			password: hashedPassword,
		})
		.returning();

	const [google] = await db
		.insert(companies)
		.values({
			name: 'Google',
			ownerId: adam.id,
			phoneNumber: '222 222 2222',
		})
		.returning();

	const [seniorWebDeveloper] = await db
		.insert(jobOffers)
		.values({
			companyId: google.id,
			description: '',
			employmentType: 'b2b',
			level: 'senior',
			position: 'Senior Web Developer',
			salaryCurrency: 'pln',
			salaryFrom: 25000,
			salaryTo: 30000,
			workType: 'full_time',
			published: true,
		})
		.returning();

	const [skillAi] = await db
		.insert(skills)
		.values({ name: 'AI', public: true })
		.returning();

	const [technologyPython] = await db
		.insert(technologies)
		.values({ name: 'Python', public: true })
		.returning();

	const [googleApplication] = await db
		.insert(applications)
		.values({
			jobOfferId: seniorWebDeveloper.id,
			userId: jon.id,
			introduction: 'Hello Google, I want to work for you',
		})
		.returning();

	const [googleChat] = await db.insert(chats).values({}).returning();
	await db.insert(chatUsers).values({ chatId: googleChat.id, userId: adam.id });
	await db.insert(chatUsers).values({ chatId: googleChat.id, userId: jon.id });

	await db.insert(messages).values({
		chatId: googleChat.id,
		userId: adam.id,
		content:
			'Hello Jon, I am inviting you on the first stage of our recruitment process',
	});
	await db.insert(messages).values({
		chatId: googleChat.id,
		userId: jon.id,
		content: 'Hello Adam, thank you very much!!',
	});

	const [googleRecruitment] = await db
		.insert(recruitments)
		.values({
			applicationId: googleApplication.id,
			chatId: googleChat.id,
		})
		.returning();

	return {
		adam,
		jon,
		google,
		seniorWebDeveloper,
		skillAi,
		technologyPython,
		googleApplication,
		googleRecruitment,
		googleChat,
	};
};

export type TestDatabase = Awaited<ReturnType<typeof initializeDB>>;

export const cleanupDB = async () => {
	const query = sql<string>`SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'`;

	const tables = await db.execute(query);

	for (let table of tables.rows) {
		const query = sql.raw(
			`TRUNCATE TABLE public."${table.table_name}" CASCADE`
		);
		await db.execute(query);
	}
};
