/**
 * Asteroids route.
 */

import express, { type Router } from 'express';
import { asteroidsController } from '../controllers/asteroidsController';

const router: Router = express.Router();

router.get('/', asteroidsController.getAsteroids.bind(asteroidsController));
router.get('/:id', asteroidsController.getAsteroidById.bind(asteroidsController));

export default router;
