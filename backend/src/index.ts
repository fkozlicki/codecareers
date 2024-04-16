import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { corsOptions } from './config/corsOptions';
import { serveFile } from './lib/s3';
import { authorizeCv } from './middleware/authorization';
import { requireSession, verifySession } from './middleware/session';
import { applicationsRouter } from './routes/application.routes';
import { authRouter } from './routes/auth.routes';
import { companiesRouter } from './routes/company.routes';
import { jobOffersRouter } from './routes/jobOffer.routes';
import { recruitmentsRouter } from './routes/recruitment.routes';
import { skillsRouter } from './routes/skill.routes';
import { technologiesRouter } from './routes/technology.routes';
import { usersRouter } from './routes/user.routes';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
import { chats } from './db/schema';
import { chatsRouter } from './routes/chat.routes';

dotenv.config({ path: `.env.${process.env.NODE_ENV ?? 'development'}` });

const port = process.env.PORT || 3000;

export const app = express();
const server = createServer(app);
export const io = new Server(server, {
	cors: {
		origin: 'http://localhost:5173',
	},
});

io.on('connection', (socket) => {
	console.log(`User Connected: ${socket.id}`);

	socket.on('join_room', (data) => {
		socket.join(data);
	});

	// socket.on("send_message", (data) => {
	//   socket.to(data.room).emit("receive_message", data);
	// });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
