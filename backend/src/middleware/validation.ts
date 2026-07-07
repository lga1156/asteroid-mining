/**
 * Validation middleware for request parameters and bodies.
 */

import { Request, Response, NextFunction } from 'express';

export function validateMineRequest(req: Request, res: Response, next: NextFunction) {
  const { asteroids } = req.body;
  // your code here
  return next();
}
