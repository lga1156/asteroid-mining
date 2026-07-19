/**
 * statusById - Get asteroid status by ID.
 * @param asteroidId - Asteroid ID
 * @returns Asteroid status
 */

import { AsteroidStatus } from '../types';
import { dbService } from '../services/dbService';

export async function statusById(asteroidId: string): Promise<AsteroidStatus> {
    const minedAsteroid = await dbService.getMinedAsteroid(asteroidId);
    if (!minedAsteroid) {
        return 'available';
    }

    const mining = await dbService.getMining(minedAsteroid.mining_id);
    return mining?.status ?? 'available';
}
