import supertest from 'supertest';
import { TestDatabase, cleanupDB, initializeDB, password } from './data';
import { app } from '../index';

let db: TestDatabase;
let adamSession = '';

beforeEach(async () => {
	const database = await initializeDB();
	db = database;

	const adamResult = await supertest(app).post('/login/credentials').send({
		email: database.adam.email,
		password,
	});
	adamSession = adamResult.header['set-cookie'];
});

afterEach(async () => {
	await cleanupDB();
});

describe('User service', () => {
	describe('[PUT] /users/:id', () => {
		it('Should update user', async () => {
			const newValues = { firstName: 'Marc', lastName: 'Gray' };

			const { statusCode, body } = await supertest(app)
				.put(`/users/${db.adam.id}`)
				.set('Cookie', adamSession)
				.send(newValues);

			expect(statusCode).toBe(200);
			expect(body.user.firstName).toBe(newValues.firstName);
			expect(body.user.lastName).toBe(newValues.lastName);
		});
	});
});
