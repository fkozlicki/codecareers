import { Request, Response } from 'express';
import { db } from '../db';

export const getSkills = async (req: Request, res: Response) => {
	const skills = await db.query.skills.findMany();

	res.status(200).json({ skills });
};
