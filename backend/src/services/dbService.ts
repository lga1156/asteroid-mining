/**
 * DBService - Database CRUD operations.
 */

import { db } from '../config/database';
import { Mining, MinedAsteroid } from '../types';

export class DBService {
    /**
     * Create a mining record.
     * @param mining - Mining record
     */
    public async createMining(mining: Mining): Promise<void> {
        db.minings.set(mining.id, mining);
    }

    /**
     * Get a mining record by ID.
     * @param id - Mining ID
     * @returns Mining record or undefined
     */
    public async getMining(id: string): Promise<Mining | undefined> {
        return db.minings.get(id);
    }

    /**
     * Get all mining records.
     * @returns Array of mining records
     */
    public async getAllMinings(): Promise<Mining[]> {
        return [...db.minings.values()];
    }

    /**
     * Update mining status.
     * @param id - Mining ID
     * @param status - New status
     */
    public async updateMiningStatus(id: string, status: Mining['status']): Promise<void> {
        const mining = db.minings.get(id);
        if (mining) {
            db.minings.set(id, { ...mining, status });
        }
    }

    /**
     * Update all mining statuses.
     * @param status - New status
     */
    public async updateAllMiningStatuses(status: Mining['status']): Promise<void> {
        for (const mining of db.minings.values()) {
            db.minings.set(mining.id, { ...mining, status });
        }
    }

    public async deleteMining(id: string): Promise<void> {
        db.minings.delete(id);
    }

    /**
     * Create a mined asteroid record.
     * @param minedAsteroid - Mined asteroid record
     */
    public async createMinedAsteroid(minedAsteroid: MinedAsteroid): Promise<void> {
        db.mined_asteroids.set(minedAsteroid.id, minedAsteroid);
    }

    /**
     * Get a mined asteroid record by ID.
     * @param id - Mined asteroid ID
     * @returns Mined asteroid record or undefined
     */
    public async getMinedAsteroid(id: string): Promise<MinedAsteroid | undefined> {
        return db.mined_asteroids.get(id);
    }

    /**
     * Get mined asteroids by mining ID.
     * @param miningId - Mining ID
     * @returns Array of mined asteroid records
     */
    public async getMinedAsteroidsByMiningId(miningId: string): Promise<MinedAsteroid[]> {
        return [...db.mined_asteroids.values()].filter(
            (minedAsteroid) => minedAsteroid.mining_id === miningId
        );
    }

    public async deleteMinedAsteroid(id: string): Promise<void> {
        db.mined_asteroids.delete(id);
    }
}

export const dbService = new DBService();
