import { Request, Response } from 'express';
import { db } from '../db';

export const getTechnologies = async (req: Request, res: Response) => {
	const technologies = await db.query.technologies.findMany();

	res.status(200).json({ technologies });
};
