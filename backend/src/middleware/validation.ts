/**
 * Validation middleware for request parameters and bodies.
 */

import { Request, Response, NextFunction } from 'express';

const MAX_ASTEROIDS_PER_MINING = 100;
const UUID_V7_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;

export function validateMineRequest(req: Request, res: Response, next: NextFunction): void {
    const body: unknown = req.body;
    const asteroids =
        typeof body === 'object' && body !== null && 'asteroids' in body
            ? (body as { asteroids?: unknown }).asteroids
            : undefined;

    if (!Array.isArray(asteroids) || asteroids.length === 0) {
        res.status(400).json({
            error: 'Asteroids must be a non-empty array',
            code: 400,
        });
        return;
    }

    if (asteroids.length > MAX_ASTEROIDS_PER_MINING) {
        res.status(400).json({
            error: `No more than ${MAX_ASTEROIDS_PER_MINING} asteroids can be mined at once`,
            code: 400,
        });
        return;
    }

    if (asteroids.some((id) => typeof id !== 'string' || !UUID_V7_PATTERN.test(id))) {
        res.status(400).json({
            error: 'Every asteroid ID must be a valid UUID v7',
            code: 400,
        });
        return;
    }

    return next();
}
