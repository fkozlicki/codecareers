import supertest from 'supertest';
import { app } from '../index.js';
import { TestDatabase, cleanupDB, initializeDB, password } from './data.js';

let jonSession = '';
let db: TestDatabase;

beforeEach(async () => {
	const database = await initializeDB();
	db = database;

	const jonResult = await supertest(app).post('/login/credentials').send({
		email: database.jon.email,
		password,
	});
	jonSession = jonResult.header['set-cookie'];
});

afterEach(async () => {
	await cleanupDB();
});

describe('Recruitment service', () => {
	describe('[GET] /recruitments', () => {
		it("Should return list of user's recruitments", async () => {
			const { statusCode, body } = await supertest(app)
				.get('/recruitments')
				.set('Cookie', jonSession);

			expect(statusCode).toBe(200);
			for (const recruitment of body.recruitments) {
				expect(recruitment).toMatchSnapshot({
					id: expect.any(String),
					jobOffer: { createdAt: expect.any(String) },
				});
			}
		});
	});

	describe('[GET] /recruitments/:id', () => {
		it('Should return recruitment', async () => {
			const { statusCode, body } = await supertest(app)
				.get(`/recruitments/${db.googleRecruitment.id}`)
				.set('Cookie', jonSession);

			expect(statusCode).toBe(200);
			expect(body.recruitment).toMatchSnapshot({
				id: expect.any(String),
				chatId: expect.any(String),
				application: {
					createdAt: expect.any(String),
					jobOffer: {
						createdAt: expect.any(String),
					},
				},
			});
		});
	});
});
