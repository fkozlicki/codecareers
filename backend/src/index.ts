import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { corsOptions } from './config/corsOptions';
import { serveFile } from './lib/s3';
import { authorizeCv } from './middleware/authorization';
import { requireSession, verifySession } from './middleware/session';
import { applicationsRouter } from './routes/applications';
import { authRouter } from './routes/auth';
import { companiesRouter } from './routes/companies';
import { jobOffersRouter } from './routes/jobOffers';
import { skillsRouter } from './routes/skills';
import { technologiesRouter } from './routes/technologies';
import { usersRouter } from './routes/users';

dotenv.config();

const port = process.env.PORT || 3000;

export const createServer = () => {
	const app = express();

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
	app.use('/avatars/:filename', serveFile('avatars'));
	app.use('/cv/:filename', requireSession, authorizeCv, serveFile('cvs'));

	return app;
};

const app = createServer();

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
