import { Request, Response } from 'express';
import * as technologyService from '../services/technology.service.js';

export const getTechnologies = async (req: Request, res: Response) => {
	const technologies = await technologyService.findTechnologies();

	res.status(200).json({ technologies });
};
