import supertest from 'supertest';
import { app } from '../index.js';
import { cleanupDB, initializeDB, password } from './data.js';

let adamSession = '';

beforeEach(async () => {
	const database = await initializeDB();

	// sign in
	const adamResult = await supertest(app).post('/login/credentials').send({
		email: database.adam.email,
		password,
	});
	adamSession = adamResult.header['set-cookie'];
});

afterEach(async () => {
	await cleanupDB();
});

describe('Skill service', () => {
	describe('[GET] /skills', () => {
		it('Should return list of public skills', async () => {
			const { statusCode, body } = await supertest(app)
				.get('/skills')
				.set('Cookie', adamSession);

			expect(statusCode).toBe(200);
			for (const skill of body.skills) {
				expect(skill.public).toBeTruthy();
				expect(skill).toMatchSnapshot({
					id: expect.any(String),
				});
			}
		});
	});
});
