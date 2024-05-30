import { Request, Response } from 'express';
import * as recruitmentService from '../services/recruitment.service';

export const getRecruitments = async (req: Request, res: Response) => {
	try {
		const result = await recruitmentService.findRecruitmentsByUserId(
			res.locals.user.id
		);

		res.status(200).json({ recruitments: result });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};

export const getRecruitment = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const recruitment = await recruitmentService.findRecruitmentById(id);

		if (!recruitment) {
			return res.status(404).json({ message: 'Not found' });
		}

		res.status(200).json({ recruitment });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
};
