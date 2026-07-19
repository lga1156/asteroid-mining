/**
 * status - Get mining status snapshot.
 * @returns Array of mining records
 */

import { dbService } from '../services/dbService';
import { MiningSnapshot } from '../types';

export async function status(): Promise<MiningSnapshot[]> {
    const minings = await dbService.getAllMinings();
    const now = Date.now();

    return Promise.all(
        minings.map(async (mining) => {
            const currentStatus =
                mining.status === 'active' && mining.ttl <= now ? 'done' : mining.status;
            if (currentStatus !== mining.status) {
                await dbService.updateMiningStatus(mining.id, currentStatus);
            }
            const minedAsteroids = await dbService.getMinedAsteroidsByMiningId(mining.id);
            return {
                ...mining,
                status: currentStatus,
                asteroids: minedAsteroids.map((asteroid) => asteroid.id),
            };
        })
    );
}
