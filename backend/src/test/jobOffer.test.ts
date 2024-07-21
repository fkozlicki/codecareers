import supertest from 'supertest';
import { TestDatabase, cleanupDB, initializeDB, password } from './data.js';
import app from '../app.js';

let db: TestDatabase;
let adamSession = '';
let jonSession = '';

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

describe('JobOffer service', () => {
	describe('[GET] /job-offers', () => {
		it('Should return list of public job-offers', async () => {
			const { statusCode, body } = await supertest(app).get('/job-offers');

			expect(statusCode).toBe(200);
			for (const jobOffer of body.jobOffers) {
				expect(jobOffer).toMatchSnapshot({
					id: expect.any(String),
					companyId: expect.any(String),
					createdAt: expect.any(String),
					company: { id: expect.any(String), ownerId: expect.any(String) },
				});
			}
		});
	});

	describe('[GET] /job-offers/:id', () => {
		it('Should return job offer', async () => {
			const { statusCode, body } = await supertest(app).get(
				`/job-offers/${db.seniorWebDeveloper.id}`
			);

			expect(statusCode).toBe(200);
			expect(body.jobOffer).toMatchSnapshot({
				id: expect.any(String),
				createdAt: expect.any(String),
				companyId: expect.any(String),
				company: {
					id: expect.any(String),
					ownerId: expect.any(String),
				},
			});
		});
	});

	describe('[PUT] /job-offers/:id', () => {
		it('Should update job offer', async () => {
			const { statusCode, body } = await supertest(app)
				.put(`/job-offers/${db.seniorWebDeveloper.id}`)
				.set('cookie', adamSession)
				.send({
					position: 'Junior Web Developer',
					description: 'Looking for passionate junior web developer',
					level: 'junior',
				});

			expect(statusCode).toBe(200);
			expect(body.jobOffer).toMatchSnapshot({
				id: expect.any(String),
				createdAt: expect.any(String),
				companyId: expect.any(String),
			});
		});
	});

	describe('[POST] /job-offers/:id/applications', () => {
		it('Should create application for job offer', async () => {
			const { statusCode, body } = await supertest(app)
				.post(`/job-offers/${db.seniorWebDeveloper.id}/applications`)
				.set('cookie', jonSession)
				.send({
					introduction:
						'Hello Google, I would love to work for you as Senior Web Developer',
				});

			expect(statusCode).toBe(201);
			expect(body.application).toMatchSnapshot({
				id: expect.any(String),
				createdAt: expect.any(String),
				jobOfferId: expect.any(String),
				userId: expect.any(String),
			});
		});
	});

	describe('[GET] /job-offers/:id/applications', () => {
		it('Should return list of applications for job offer', async () => {
			const { statusCode, body } = await supertest(app)
				.get(`/job-offers/${db.seniorWebDeveloper.id}/applications`)
				.set('cookie', adamSession);

			expect(statusCode).toBe(200);
			for (const application of body.applications) {
				expect(application).toMatchSnapshot({
					id: expect.any(String),
					jobOfferId: expect.any(String),
					createdAt: expect.any(String),
					user: {
						id: expect.any(String),
					},
				});
			}
		});
	});
});
