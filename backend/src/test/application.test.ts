import supertest from 'supertest';
import { TestDatabase, cleanupDB, initializeDB, password } from './data';
import app from '../app';

let db: TestDatabase;
let jonSession = '';
let adamSession = '';

beforeEach(async () => {
	const database = await initializeDB();
	db = database;

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

describe('Aplication service', () => {
	describe('[GET] /applications', () => {
		it("Should return list of user's applications", async () => {
			const { statusCode, body } = await supertest(app)
				.get('/applications')
				.set('Cookie', jonSession);

			expect(statusCode).toBe(200);
			for (const application of body.applications) {
				expect(application).toMatchSnapshot({
					id: expect.any(String),
					createdAt: expect.any(String),
					jobOffer: {
						id: expect.any(String),
						createdAt: expect.any(String),
						company: {
							id: expect.any(String),
						},
					},
				});
			}
		});
	});

	describe('[POST] /applications/:id/accept', () => {
		it("Should change application's accepted value to true", async () => {
			const { statusCode, body } = await supertest(app)
				.post(`/applications/${db.googleApplication.id}/accept`)
				.set('Cookie', adamSession);

			expect(statusCode).toBe(200);
			expect(body.application.accepted).toBeTruthy();
		});
	});

	describe('[POST] /applications/:id/reject', () => {
		it("Should change application's accepted value to false", async () => {
			const { statusCode, body } = await supertest(app)
				.post(`/applications/${db.googleApplication.id}/reject`)
				.set('Cookie', adamSession);

			expect(statusCode).toBe(200);
			expect(body.application.accepted).toBeFalsy();
		});
	});
});
