/**
 * Error handling middleware.
 */

import { Request, Response, NextFunction } from 'express';

export class HttpError extends Error {
    public constructor(
        message: string,
        public readonly status: number
    ) {
        super(message);
        this.name = 'HttpError';
    }
}

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    const errorStatus =
        err instanceof Error &&
        'status' in err &&
        typeof (err as { status?: unknown }).status === 'number'
            ? (err as { status: number }).status
            : 500;
    const status = errorStatus >= 400 && errorStatus < 600 ? errorStatus : 500;
    const message = status < 500 && err instanceof Error ? err.message : 'Internal server error';

    console.error(err);
    res.status(status).json({ error: message, code: status });
}
