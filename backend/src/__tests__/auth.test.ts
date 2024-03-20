import supertest from 'supertest';
import { createServer } from '..';

const app = createServer();

describe('Auth Service', () => {
	describe('[POST] /signup', () => {
		it('When no user with the same email exists, create new user', async () => {
			const { statusCode, body } = await supertest(app).post('/signup').send({
				firstName: 'Anna',
				lastName: 'Marie',
				email: 'annamarie@gmail.com',
				password: 'annamarie123',
			});

			expect(statusCode).toBe(201);
			expect(body).toEqual({ message: 'Signed up successfully' });
		});
	});
});
