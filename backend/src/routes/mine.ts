/**
 * Mine route.
 */

import express, { type Router } from 'express';
import { mineController } from '../controllers/mineController';
import { validateMineRequest } from '../middleware/validation';

const router: Router = express.Router();

router.post('/', validateMineRequest, mineController.createMining.bind(mineController));

export default router;
