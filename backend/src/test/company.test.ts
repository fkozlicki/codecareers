import { randomUUID } from 'crypto';
import supertest from 'supertest';
import app from '../app';
import { TestDatabase, cleanupDB, initializeDB } from './data';

const password = 'S3cReT123';

let db: TestDatabase;
let adamSession = '';
let jonSession = '';

const companyRequest = {
	name: 'Amazon',
	description: 'Lorem ipsum',
	phoneNumber: '222 222 2222',
};

beforeEach(async () => {
	const database = await initializeDB();

	db = database;

	// sign in
	const adamResult = await supertest(app).post('/login/credentials').send({
		email: database.adam.email,
		password,
	});
	adamSession = adamResult.header['set-cookie'];

	const jonResult = await supertest(app).post('/login/credentials').send({
		email: database.jon.email,
		password,
	});

	jonSession = jonResult.header['set-cookie'];
});

afterEach(async () => {
	await cleanupDB();
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
				// missing phone number
				{ name: 'Amazon', description: 'Lorem ipsum' },
			];

			for (const credentials of invalidCredentials) {
				const { statusCode, body } = await supertest(app)
					.post('/companies')
					.set('cookie', adamSession)
					.send(credentials);

				expect(statusCode).toBe(400);
				expect(body.message).toEqual('Invalid data');
			}
		});
	});

	describe('[GET] /companies/:id', () => {
		it('Return company, when user have access to it', async () => {
			const { statusCode, body } = await supertest(app)
				.get(`/companies/${db.google.id}`)
				.set('cookie', adamSession);

			expect(statusCode).toBe(200);
			expect(body.company).toMatchSnapshot({
				id: expect.any(String),
			});
		});

		it('Throw 401, when user is not signed in', async () => {
			const { statusCode, body } = await supertest(app).get(
				`/companies/${db.google.id}`
			);

			expect(statusCode).toBe(401);
			expect(body).toEqual({ message: 'Auth required' });
		});

		it('Throw 403, when user does not have access to company', async () => {
			const { statusCode, body } = await supertest(app)
				.get(`/companies/${db.google.id}`)
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
				.get(`/companies/?userId=${db.adam.id}`)
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
				.put(`/companies/${db.google.id}`)
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
				.put(`/companies/${db.google.id}`)
				.send({
					name: 'Google Inc.',
					description: 'This is Google Inc. after update',
				});

			expect(statusCode).toBe(401);
			expect(body).toEqual({ message: 'Auth required' });
		});

		it('Throw 403, when user does not have access to company', async () => {
			const { statusCode, body } = await supertest(app)
				.put(`/companies/${db.google.id}`)
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

	describe('[DELETE] /companies/:id', () => {
		it('Should delete job offer', async () => {
			const { statusCode, body } = await supertest(app)
				.delete(`/companies/${db.google.id}`)
				.set('cookie', adamSession);

			expect(statusCode).toBe(200);
			expect(body.company).toMatchSnapshot({
				id: expect.any(String),
				ownerId: expect.any(String),
			});
		});
	});

	describe('[POST] /comapnies/:id/job-offers', () => {
		it('Should create new job offer', async () => {
			const { statusCode, body } = await supertest(app)
				.post(`/companies/${db.google.id}/job-offers`)
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
					skills: [{ label: 'AI', value: db.skillAi.id }],
					technologies: [{ label: 'Python', value: db.technologyPython.id }],
				});

			expect(statusCode).toBe(201);
			expect(body.jobOffer).toMatchSnapshot({
				id: expect.any(String),
				createdAt: expect.any(String),
				companyId: expect.any(String),
			});
		});
	});

	describe('[GET] /comapnies/:id/job-offers', () => {
		it("Should return list of company's job offers", async () => {
			const { statusCode, body } = await supertest(app)
				.get(`/companies/${db.google.id}/job-offers`)
				.set('cookie', adamSession);

			expect(statusCode).toBe(200);
			for (const jobOffer of body.jobOffers) {
				expect(jobOffer).toMatchSnapshot({
					id: expect.any(String),
					createdAt: expect.any(String),
					companyId: expect.any(String),
					company: {
						id: expect.any(String),
						ownerId: expect.any(String),
					},
				});
			}
		});
	});

	describe('[GET] /companies/:id/recruitments', () => {
		it('Throw 401, when user is not signed in', async () => {
			const { statusCode, body } = await supertest(app).get(
				`/companies/${db.google.id}/recruitments`
			);

			expect(statusCode).toBe(401);
			expect(body).toEqual({ message: 'Auth required' });
		});

		it('Throw 403, when user is trying to get others comapny recruitments', async () => {
			const { statusCode, body } = await supertest(app)
				.get(`/companies/${db.google.id}/recruitments`)
				.set('cookie', jonSession);

			expect(statusCode).toBe(403);
			expect(body.message).toBe(
				"You don't have permission to access this data"
			);
		});

		it('Throw 404, when user is trying to get recruitments of company that does not exists', async () => {
			const id = randomUUID();

			const { statusCode, body } = await supertest(app)
				.get(`/companies/${id}/recruitments`)
				.set('cookie', jonSession);

			expect(statusCode).toBe(404);
			expect(body).toEqual({ message: `Company with id ${id} not found` });
		});

		it("Should return list of company's recruitments", async () => {
			const { statusCode, body } = await supertest(app)
				.get(`/companies/${db.google.id}/recruitments`)
				.set('cookie', adamSession);

			expect(statusCode).toBe(200);

			for (const recruitment of body.recruitments) {
				expect(recruitment).toMatchSnapshot({
					id: expect.any(String),
					user: {
						id: expect.any(String),
					},
				});
			}
		});
	});
});
