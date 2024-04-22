import { NextFunction, Request, Response } from 'express';
import { lucia } from '../lib/lucia.js';

export const requireSession = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!res.locals.session) {
		res.status(401).json({ message: 'Auth required' });
		return;
	}

	next();
};

export const verifySession = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const sessionId = lucia.readSessionCookie(req.headers.cookie ?? '');

	if (!sessionId) {
		res.locals.user = null;
		res.locals.session = null;
		return next();
	}

	const { session, user } = await lucia.validateSession(sessionId);

	if (session && session.fresh) {
		res.appendHeader(
			'Set-Cookie',
			lucia.createSessionCookie(session.id).serialize()
		);
	}
	if (!session) {
		res.appendHeader(
			'Set-Cookie',
			lucia.createBlankSessionCookie().serialize()
		);
	}
	res.locals.session = session;
	res.locals.user = user;
	return next();
};
