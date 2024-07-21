import supertest from 'supertest';
import { TestDatabase, cleanupDB, initializeDB, password } from './data.js';
import app from '../app.js';

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
	describe('[GET] /chats/:id/messages', () => {
		it("Should list chat's messages", async () => {
			const { statusCode, body } = await supertest(app)
				.get(`/chats/${db.googleChat.id}/messages`)
				.set('Cookie', adamSession);

			expect(statusCode).toBe(200);
			for (const message of body.messages) {
				expect(message).toMatchSnapshot({
					id: expect.any(String),
					createdAt: expect.any(String),
				});
			}
		});
	});

	describe('[POST] /chats/:id/messages', () => {
		it('Should create a message', async () => {
			const { statusCode, body } = await supertest(app)
				.post(`/chats/${db.googleChat.id}/messages`)
				.set('Cookie', adamSession)
				.send({
					content: 'Here is my schedule, pick the date that fits you :)',
				});

			expect(statusCode).toBe(201);
			expect(body.message).toMatchSnapshot({
				id: expect.any(String),
				createdAt: expect.any(String),
			});
		});
	});
});
