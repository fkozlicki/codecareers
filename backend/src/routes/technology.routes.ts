import { Router } from 'express';
import { getTechnologies } from '../controllers/technology.controller';
import { requireSession } from '../middleware/session';

export const technologiesRouter = Router();

technologiesRouter.route('/').get(requireSession, getTechnologies);
