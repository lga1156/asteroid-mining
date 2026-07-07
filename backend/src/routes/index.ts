/**
 * Routes aggregator.
 */

import express, { type Router } from 'express';
//@ts-ignore
import swaggerUi from 'swagger-ui-express';
import {openapiDocument} from './openapi';

const router:Router = express.Router();
router.use('/asteroids', ); // your code here
router.use('/mine', ); //   your code here
// @ts-ignore
router.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument)); // route for swagger docs

export default router;
