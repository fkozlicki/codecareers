import { Router } from 'express';
import { getTechnologies } from '../controllers/technology.controller.js';
import { requireSession } from '../middleware/session.js';

export const technologiesRouter = Router();

technologiesRouter.route('/').get(requireSession, getTechnologies);
