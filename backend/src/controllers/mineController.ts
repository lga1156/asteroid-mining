/**
 * MineController - Handle /mine requests.
 */

import { NextFunction, Request, Response } from 'express';
import { createMining } from '../functions/createMining';
import { statusById } from '../functions/statusById';
import { asteroidsService } from '../services/asteroidsService';
import { HttpError } from '../middleware/errorHandler';

let miningQueue: Promise<void> = Promise.resolve();

function serializeMining<T>(operation: () => Promise<T>): Promise<T> {
    const result = miningQueue.then(operation, operation);
    miningQueue = result.then(
        () => undefined,
        () => undefined
    );
    return result;
}

export class MineController {
    public async createMining(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const asteroidIds = (req.body as { asteroids: string[] }).asteroids;
            const mining = await serializeMining(async () => {
                const asteroids = await Promise.all(
                    asteroidIds.map((id) => asteroidsService.getAsteroidById(id))
                );
                if (asteroids.some((asteroid) => asteroid === null)) {
                    throw new HttpError('One or more asteroids are not identified', 400);
                }

                const statuses = await Promise.all(asteroidIds.map((id) => statusById(id)));
                if (statuses.some((status) => status !== 'available')) {
                    throw new HttpError('One or more asteroids are not available for mining', 400);
                }

                return createMining(asteroidIds);
            });

            res.json(mining);
        } catch (error) {
            next(error);
        }
    }
}

export const mineController = new MineController();
