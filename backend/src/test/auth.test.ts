import supertest from 'supertest';
import app from '../app.js';
import { cleanupDB, initializeDB, password } from './data.js';

beforeEach(async () => {
	await initializeDB();
});

afterEach(async () => {
	await cleanupDB();
});

describe('Auth Service', () => {
	describe('[POST] /signup', () => {
		it('Create new user, when credentials are valid and no user with the same email exists', async () => {
			const { statusCode, body } = await supertest(app).post('/signup').send({
				firstName: 'Anna',
				lastName: 'Marie',
				email: 'annamarie@gmail.com',
				password: 'annamarie123',
			});

			expect(statusCode).toBe(201);
			expect(body).toEqual({ message: 'Signed up successfully' });
		});

		it('When user with same email exists, throw a 409 (duplicate) error', async () => {
			const { statusCode, body } = await supertest(app).post('/signup').send({
				firstName: 'Jon',
				lastName: 'Snow',
				email: 'jon.snow@gmail.com',
				password: 'jonsnow123',
			});

			expect(statusCode).toBe(409);
			expect(body).toEqual({ message: 'User with this email already exists' });
		});

		it('Throw 400 when data is invalid', async () => {
			const invalidCredentials = [
				// missing lastName
				{
					firstName: 'Lilly',
					email: 'lilly@gmail.com',
					password: 'lilly123',
				},
				// missing firstName
				{
					lastName: 'Pietrova',
					email: 'pietrova@gmail.com',
					password: 'pietrova123',
				},
				// missing email
				{
					firstName: 'Alan',
					lastName: 'Walker',
					password: 'alanwalker123',
				},
				// missing password
				{
					firstName: 'Jake',
					lastName: 'Paul',
					email: 'jake.paul@gmail.com',
				},
			];

			for (let credentials of invalidCredentials) {
				const { statusCode, body } = await supertest(app)
					.post('/signup')
					.send(credentials);

				expect(statusCode).toBe(400);
				expect(body.message).toEqual('Invalid data');
			}
		});
	});

	describe('[POST] /login/credentials', () => {
		it('Sign in, when credentials are valid', async () => {
			const { statusCode, body } = await supertest(app)
				.post('/login/credentials')
				.send({
					email: 'jon.snow@gmail.com',
					password,
				});

			expect(statusCode).toBe(200);
			expect(body.user).toMatchSnapshot({
				id: expect.any(String),
			});
		});

		it('Throw 400, when data is invalid', async () => {
			const invalidCredentials = [
				// missing email
				{
					password: 'alanwalker123',
				},
				// missing password
				{
					email: 'jake.paul@gmail.com',
				},
			];

			for (let credentials of invalidCredentials) {
				const { statusCode, body } = await supertest(app)
					.post('/login/credentials')
					.send(credentials);

				expect(statusCode).toBe(400);
				expect(body.message).toEqual('Invalid data');
			}
		});
	});
});
