import { Router } from 'express';
import { getJobOffer, getJobOffers } from '../controllers/jobOffersController';

export const jobOffersRouter = Router();

jobOffersRouter.route('/').get(getJobOffers);
jobOffersRouter.route('/:id').get(getJobOffer);
