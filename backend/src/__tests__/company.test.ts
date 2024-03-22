import supertest from 'supertest';
import { app } from '..';
import { db } from '../db';
import { companies } from '../db/schema';

const password = 'S3cReT123';

const companyRequest = {
	name: 'Amazon',
	description: 'Lorem ipsum',
	phoneNumber: '222 222 2222',
};

describe('Company service', () => {
	describe('[POST] /companies', () => {
		it('Create company, when user is signed in and body is valid', async () => {
			// sign in
			const { header } = await supertest(app).post('/login/credentials').send({
				email: 'jon.snow@gmail.com',
				password,
			});

			// create company
			const { statusCode, body } = await supertest(app)
				.post('/companies')
				.set('cookie', header['set-cookie'])
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

		it('Throw 401, when use is not signed in', async () => {
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

			// sign in
			const { header } = await supertest(app).post('/login/credentials').send({
				email: 'jon.snow@gmail.com',
				password,
			});

			for (const credentials of invalidCredentials) {
				const { statusCode, body } = await supertest(app)
					.post('/companies')
					.set('cookie', header['set-cookie'])
					.send(credentials);

				expect(statusCode).toBe(400);
				expect(body).toEqual({ error: 'Invalid data' });
			}
		});
	});

	describe('[GET] /company/:id', () => {
		beforeAll(async () => {
			await db.insert(companies).values({
				name: '',
			});
		});

		it('Throw 401, when user is not signed in', async () => {
			// sign in
			const { header } = await supertest(app).post('/login/credentials').send({
				email: 'jon.snow@gmail.com',
				password,
			});

			// create company
			const { statusCode, body } = await supertest(app)
				.get('/companies/')
				.set('cookie', header['set-cookie'])
				.send(companyRequest);
		});
	});
});
