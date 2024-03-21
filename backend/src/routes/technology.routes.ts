import { Router } from 'express';
import { getTechnologies } from '../controllers/technology.controller';

export const technologiesRouter = Router();

technologiesRouter.route('/').get(getTechnologies);
