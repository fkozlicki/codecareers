import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { corsOptions } from './config/corsOptions';
import { verifySession } from './middleware/session';
import { authRouter } from './routes/auth';
import { companiesRouter } from './routes/companies';
import { jobOffersRouter } from './routes/jobOffers';
import { technologiesRouter } from './routes/technologies';
import { skillsRouter } from './routes/skills';
import { applicationsRouter } from './routes/applications';
import { getFileFromS3 } from './lib/s3';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

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
app.use('/cv/:filename', async (req, res) => {
	const filename = req.params.filename;

	try {
		const Body = await getFileFromS3(`cvs/${filename}`);

		if (Body) {
			const buffer = await Body.transformToByteArray();
			res.setHeader('Content-Type', 'application/pdf');
			res.send(Buffer.from(buffer));
		} else {
			res.send(404).send('File not found');
		}
	} catch (err) {
		console.error(err);
		res.status(404).send('File not found');
	}
});

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
