/**
 * updateMining - Update mining status.
 * @param status - New status
 */

import { Mining } from '../types';
import { dbService } from '../services/dbService';

export async function updateMining(status: Mining['status']): Promise<void> {
    await dbService.updateAllMiningStatuses(status);
}
