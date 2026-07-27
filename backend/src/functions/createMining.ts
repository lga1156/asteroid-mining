/**
 * createMining - Create mining record.
 * @param asteroidIds - Array of asteroid IDs
 * @returns Mining response
 */

import { MINING_UPDATE_INTERVAL } from '../config/constants';
import { dbService } from '../services/dbService';
import { Mining, MinedAsteroid, MiningResponse } from '../types';
import { randomUUID } from 'node:crypto';

export async function createMining(asteroidIds: string[]): Promise<MiningResponse> {
    const miningId = randomUUID();
    const mining: Mining = {
        id: miningId,
        status: 'active',
        ttl:
            Date.now() +
            Math.min(
                MINING_UPDATE_INTERVAL,
                Math.floor(Math.random() * (MINING_UPDATE_INTERVAL + 1))
            ),
    };

    await dbService.createMining(mining);
    await Promise.all(
        asteroidIds.map((id) => {
            const minedAsteroid: MinedAsteroid = { id, mining_id: miningId };
            return dbService.createMinedAsteroid(minedAsteroid);
        })
    );

    return { id: miningId, status: 'active', asteroids: [...asteroidIds] };
}
