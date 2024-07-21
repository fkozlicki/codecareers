import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { corsOptions } from './config/corsOptions.js';
import { serveFile } from './lib/s3.js';
import { authorizeCv } from './middleware/authorization.js';
import { requireSession, verifySession } from './middleware/session.js';
import { applicationsRouter } from './routes/application.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { chatsRouter } from './routes/chat.routes.js';
import { companiesRouter } from './routes/company.routes.js';
import { jobOffersRouter } from './routes/jobOffer.routes.js';
import { recruitmentsRouter } from './routes/recruitment.routes.js';
import { skillsRouter } from './routes/skill.routes.js';
import { technologiesRouter } from './routes/technology.routes.js';
import { usersRouter } from './routes/user.routes.js';
import bodyParser from 'body-parser';

dotenv.config({ path: `.env.${process.env.NODE_ENV ?? 'development'}` });

const port = process.env.PORT || 3000;

export const app = express();
const server = createServer(app);
export const io = new Server(server, {
	cors: {
		origin: process.env.CLIENT_URI,
	},
});

io.on('connection', (socket) => {
	console.log(`User Connected: ${socket.id}`);

	socket.on('join_room', (data) => {
		socket.join(data);
	});
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use(verifySession);

app.get('/', (req: Request, res: Response) => {
	res.json({ message: 'Welcome to CodeCareers API' });
});

app.use('/', authRouter);
app.use('/companies', companiesRouter);
app.use('/job-offers', jobOffersRouter);
app.use('/technologies', technologiesRouter);
app.use('/skills', skillsRouter);
app.use('/applications', applicationsRouter);
app.use('/users', usersRouter);
app.use('/recruitments', recruitmentsRouter);
app.use('/chats', chatsRouter);
app.use('/avatars/:filename', serveFile('avatars'));
app.use('/cv/:filename', requireSession, authorizeCv, serveFile('cvs'));

if (process.env.NODE_ENV !== 'test') {
	server.listen(port, () => {
		console.log(`[server]: Server is running at http://localhost:${port}`);
	});
}
