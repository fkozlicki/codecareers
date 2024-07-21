import { Router } from 'express';
import { getSkills } from '../controllers/skill.controller.js';
import { requireSession } from '../middleware/session.js';

export const skillsRouter = Router();

skillsRouter.route('/').get(requireSession, getSkills);
