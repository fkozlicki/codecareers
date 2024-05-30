import { Router } from 'express';
import { getSkills } from '../controllers/skill.controller';
import { requireSession } from '../middleware/session';

export const skillsRouter = Router();

skillsRouter.route('/').get(requireSession, getSkills);
