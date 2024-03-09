import { Router } from 'express';
import { getTechnologies } from '../controllers/technologiesController';

export const technologiesRouter = Router();

technologiesRouter.route('/').get(getTechnologies);
