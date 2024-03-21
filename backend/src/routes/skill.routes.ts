import { Router } from 'express';
import { getSkills } from '../controllers/skill.controller';

export const skillsRouter = Router();

skillsRouter.route('/').get(getSkills);
