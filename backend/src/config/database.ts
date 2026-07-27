/**
 * Runtime database implementation using JavaScript Maps.
 * Provides in-memory storage for minings and mined_asteroids tables.
 */

import { Mining, MinedAsteroid } from '../types';

export interface Database {
    minings: Map<string, Mining>;
    mined_asteroids: Map<string, MinedAsteroid>;
}

// Initialize database with empty tables
export const db: Database = {
    minings: new Map(),
    mined_asteroids: new Map(),
};
