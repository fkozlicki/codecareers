import { Router } from 'express';
import { getSkills } from '../controllers/skillsController';

export const skillsRouter = Router();

skillsRouter.route('/').get(getSkills);