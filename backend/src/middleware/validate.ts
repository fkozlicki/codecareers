import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate =
	(schema: AnyZodObject) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
			});
			return next();
		} catch (error) {
			if (error instanceof ZodError) {
				res.status(400).json({ message: 'Invalid data' });
			} else {
				res.status(500).json({ message: 'Internal Server Error' });
			}
		}
	};
