/**
 * Error handling middleware.
 */

import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  status?: number;
}

export function errorHandler(err: CustomError, _req: Request, res: Response, _next: NextFunction) {
  // your code here
}
