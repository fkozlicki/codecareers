import { Argon2id } from 'oslo/password';
import supertest from 'supertest';
import { app } from '..';
import { db } from '../db';
import { clearDb } from '../db/helpers';
import {
	companies,
	jobOffers,
	skills,
	technologies,
	users,
} from '../db/schema';

const password = 'S3cReT123';

let adam;
let jon;
let adamSession = '';
let jonSession = '';
let google;
let skillAi;
let technologyPython;
let seniorWebDeveloper;

const companyRequest = {
	name: 'Amazon',
	description: 'Lorem ipsum',
	phoneNumber: '222 222 2222',
};

beforeEach(async () => {
	await clearDb();
});

beforeEach(async () => {
	const hashedPassword = await new Argon2id().hash(password);
	adam = (
		await db
			.insert(users)
			.values({
				firstName: 'Adam',
				lastName: 'Joseph',
				email: 'adamjospeh@gmail.com',
				password: hashedPassword,
			})
			.returning()
	)[0];

	jon = (
		await db
			.insert(users)
			.values({
				firstName: 'Jon',
				lastName: 'Snow',
				email: 'jon.snow@gmail.com',
				password: hashedPassword,
			})
			.returning()
	)[0];

	google = (
		await db
			.insert(companies)
			.values({
				name: 'Google',
				ownerId: adam!.id,
				phoneNumber: '222 222 2222',
			})
			.returning()
	)[0];

	seniorWebDeveloper = (
		await db
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
			})
			.returning()
	)[0];

	skillAi = (await db.insert(skills).values({ name: 'AI' }).returning())[0];
	technologyPython = (
		await db.insert(technologies).values({ name: 'Python' }).returning()
	)[0];

	// sign in
	const adamResult = await supertest(app).post('/login/credentials').send({
		email: 'adamjospeh@gmail.com',
		password,
	});
	adamSession = adamResult.header['set-cookie'];

	const jonResult = await supertest(app).post('/login/credentials').send({
		email: 'jon.snow@gmail.com',
		password,
	});

	jonSession = jonResult.header['set-cookie'];
});

describe('Company service', () => {
	describe('[POST] /companies', () => {
		it('Create company, when user is signed in and body is valid', async () => {
			const { statusCode, body } = await supertest(app)
				.post('/companies')
				.set('cookie', adamSession)
				.send(companyRequest);

			expect(statusCode).toBe(201);
			expect(body).toMatchObject({
				company: {
					name: 'Amazon',
					description: 'Lorem ipsum',
					phoneNumber: '222 222 2222',
					avatarUrl: null,
					backgroundUrl: null,
				},
			});
		});

		it('Throw 401, when user is not signed in', async () => {
			const { statusCode, body } = await supertest(app)
				.post('/companies')
				.send(companyRequest);

			expect(statusCode).toBe(401);
			expect(body).toEqual({ message: 'Auth required' });
		});

		it('Throw 400, when credentials are invalid', async () => {
			const invalidCredentials = [
				// missing name
				{ description: 'Lorem ipsum', phoneNumber: '222 222 2222' },
				// missing description
				{ name: 'Amazon', phoneNumber: '222 222 2222' },
				// missing phone number
				{ name: 'Amazon', description: 'Lorem ipsum' },
			];

			for (const credentials of invalidCredentials) {
				const { statusCode, body } = await supertest(app)
					.post('/companies')
					.set('cookie', adamSession)
					.send(credentials);

				expect(statusCode).toBe(400);
				expect(body).toEqual({ error: 'Invalid data' });
			}
		});
	});

	describe('[GET] /companies/:id', () => {
		it('Return company, when user have access to it', async () => {
			const { statusCode, body } = await supertest(app)
				.get(`/companies/${google!.id}`)
				.set('cookie', adamSession);

			expect(statusCode).toBe(200);
			expect(body.company).toMatchSnapshot({
				id: expect.any(String),
			});
		});

		it('Throw 401, when user is not signed in', async () => {
			const { statusCode, body } = await supertest(app).get(
				`/companies/${google!.id}`
			);

			expect(statusCode).toBe(401);
			expect(body).toEqual({ message: 'Auth required' });
		});

		it('Throw 403, when user does not have access to company', async () => {
			const { statusCode, body } = await supertest(app)
				.get(`/companies/${google!.id}`)
				.set('cookie', jonSession);

			expect(statusCode).toBe(403);
			expect(body).toEqual({
				message: "You don't have permission to access this data",
			});
		});
	});

	describe('[GET] /companies', () => {
		it("Return list of Adam's companies", async () => {
			const { statusCode, body } = await supertest(app)
				.get(`/companies/?userId=${adam!.id}`)
				.set('cookie', adamSession);

			expect(statusCode).toBe(200);
			for (const company of body.companies) {
				expect(company).toMatchSnapshot({ id: expect.any(String) });
			}
		});
	});

	describe('[PUT] /companies/:id', () => {
		it('Should update company', async () => {
			const { statusCode, body } = await supertest(app)
				.put(`/companies/${google!.id}`)
				.set('cookie', adamSession)
				.send({
					name: 'Google Inc.',
					description: 'This is Google Inc. after update',
				});

			expect(statusCode).toBe(200);
			expect(body.company).toMatchSnapshot({ id: expect.any(String) });
		});

		it('Throw 401, when user is not signed in', async () => {
			const { statusCode, body } = await supertest(app)
				.put(`/companies/${google!.id}`)
				.send({
					name: 'Google Inc.',
					description: 'This is Google Inc. after update',
				});

			expect(statusCode).toBe(401);
			expect(body).toEqual({ message: 'Auth required' });
		});

		it('Throw 403, when user does not have access to company', async () => {
			const { statusCode, body } = await supertest(app)
				.put(`/companies/${google!.id}`)
				.set('cookie', jonSession)
				.send({
					name: 'Google Inc.',
					description: 'This is Google Inc. after update',
				});

			expect(statusCode).toBe(403);
			expect(body).toEqual({
				message: "You don't have permission to access this data",
			});
		});
	});

	describe('[POST] /comapnies/:id/job-offers', () => {
		it('Should create new job offer', async () => {
			const { statusCode, body } = await supertest(app)
				.post(`/companies/${google!.id}/job-offers`)
				.set('cookie', adamSession)
				.send({
					position: 'Junior AI Engeneer',
					description: 'We are looking for talented AI Engeneer',
					level: 'junior',
					employmentType: 'internship',
					workType: 'part_time',
					salaryFrom: 6000,
					salaryTo: 8000,
					salaryCurrency: 'pln',
					skills: [{ label: 'AI', value: skillAi!.id }],
					technologies: [{ label: 'Python', value: technologyPython!.id }],
				});

			expect(statusCode).toBe(201);
			expect(body.jobOffer).toMatchSnapshot({
				id: expect.any(String),
				createdAt: expect.any(String),
			});
		});
	});

	describe('[GET] /comapnies/:id/job-offers', () => {
		it('Should return company job offers', async () => {
			const { statusCode, body } = await supertest(app)
				.get(`/companies/${google!.id}/job-offers`)
				.set('cookie', adamSession);

			expect(statusCode).toBe(200);
			for (const jobOffer of body.jobOffers) {
				expect(jobOffer).toMatchSnapshot({
					id: expect.any(String),
					createdAt: expect.any(String),
				});
			}
		});
	});
});
