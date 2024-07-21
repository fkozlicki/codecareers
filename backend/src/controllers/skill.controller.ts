import { Request, Response } from 'express';
import * as skillService from '../services/skill.service.js';

export const getSkills = async (req: Request, res: Response) => {
	const skills = await skillService.findSkills();

	res.status(200).json({ skills });
};
