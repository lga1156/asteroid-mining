/**
 * Express app setup.
 */

import express, { Application } from 'express';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';
import router from './routes';

const app: Application = express();

app.use(logger);
app.use(express.json());
app.use(router);
app.use(errorHandler);

export default app;
