/**
 * Asteroids route.
 */

import express, { type Router } from 'express';
import { asteroidsController } from '../controllers/asteroidsController';

const router: Router = express.Router();

router.get('/', asteroidsController.getAsteroids.bind(asteroidsController));

export default router;
