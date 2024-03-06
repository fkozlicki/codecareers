import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { corsOptions } from './config/corsOptions';
import { requireSession, verifySession } from './middleware/session';
import { authRouter } from './routes/auth';
import { companiesRouter } from './controllers/companiesController';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(cors(corsOptions));

app.use(verifySession);

app.get('/', (req: Request, res: Response) => {
	res.json({ message: 'Welcome to CodeCareers API' });
});

app.use('/', authRouter);
app.use('/companies', companiesRouter);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
