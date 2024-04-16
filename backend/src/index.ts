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

dotenv.config({ path: `.env.${process.env.NODE_ENV ?? 'development'}` });

const port = process.env.PORT || 3000;

export const app = express();

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
app.use('/avatars/:filename', serveFile('avatars'));
app.use('/cv/:filename', requireSession, authorizeCv, serveFile('cvs'));

if (process.env.NODE_ENV !== 'test') {
	app.listen(port, () => {
		console.log(`[server]: Server is running at http://localhost:${port}`);
	});
}
