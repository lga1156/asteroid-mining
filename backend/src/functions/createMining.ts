/**
 * createMining - Create mining record.
 * @param asteroidIds - Array of asteroid IDs
 * @returns Mining response
 */

import { MINING_UPDATE_INTERVAL } from '../config/constants';
import { dbService } from '../services/dbService';
import { Mining, MinedAsteroid, MiningResponse } from '../types';

export async function createMining(asteroidIds: string[]): Promise<MiningResponse> {
  const miningId = crypto.randomUUID();
  //  your code here
}
