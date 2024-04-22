import { NextFunction, Request, Response } from 'express';
import { allowedOrigins } from '../config/allowedOrigins.js';

export const credentials = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const origin = req.headers.origin;

	if (origin && allowedOrigins.includes(origin)) {
		res.setHeader('Access-Control-Allow-Credentials', 'true');
	}
	next();
};
