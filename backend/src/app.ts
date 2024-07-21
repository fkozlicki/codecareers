import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { corsOptions } from './config/corsOptions';
import { serveFile } from './lib/s3';
import { authorizeCv } from './middleware/authorization';
import { requireSession, verifySession } from './middleware/session';
import { applicationsRouter } from './routes/application.routes';
import { authRouter } from './routes/auth.routes';
import { chatsRouter } from './routes/chat.routes';
import { companiesRouter } from './routes/company.routes';
import { jobOffersRouter } from './routes/jobOffer.routes';
import { recruitmentsRouter } from './routes/recruitment.routes';
import { skillsRouter } from './routes/skill.routes';
import { technologiesRouter } from './routes/technology.routes';
import { usersRouter } from './routes/user.routes';

dotenv.config({ path: `.env.${process.env.NODE_ENV ?? 'development'}` });

const app = express();

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

export default app;
