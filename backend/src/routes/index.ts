/**
 * Routes aggregator.
 */

import express, { type Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { openapiDocument } from './openapi';
import asteroidsRouter from './asteroids';
import mineRouter from './mine';

const router: Router = express.Router();
router.use('/asteroids', asteroidsRouter);
router.use('/mine', mineRouter);
router.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument)); // route for swagger docs

export default router;
