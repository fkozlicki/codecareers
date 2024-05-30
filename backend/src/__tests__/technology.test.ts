import supertest from 'supertest';
import { app } from '../index';
import { cleanupDB, initializeDB, password } from './data';

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

describe('Technology service', () => {
	describe('[GET] /technologies', () => {
		it('Should return list of public technologies', async () => {
			const { statusCode, body } = await supertest(app)
				.get('/technologies')
				.set('Cookie', adamSession);

			expect(statusCode).toBe(200);
			for (const technology of body.technologies) {
				expect(technology.public).toBeTruthy();
				expect(technology).toMatchSnapshot({
					id: expect.any(String),
				});
			}
		});
	});
});
