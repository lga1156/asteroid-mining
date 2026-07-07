/**
 * AsteroidsService - Client for Asteroids API.
 * Fetches asteroid data from Asteroids API.
 * Validates responses against the asteroids contract (contract_asteroids.yaml).
 */

import { ASTEROIDS_API_URL, ASTEROIDS_CACHE_KEY_BASE } from '../config/constants';
import { cacheService } from './cacheService';


/** AsteroidSummary shape from contract_asteroids.yaml */
export interface AsteroidSummary {
  id: string;
  name: string;
  radius: number;
  mass: number;
  coordinates: {
    rightAscension: number;
    declination: number;
    distance: number;
  };
}

export class AsteroidsService {
  /**
   * Fetch asteroid IDs from Asteroids API.
   * Validates the response against the asteroids contract (list endpoint).
   * @returns Array of asteroid IDs
   * @throws ContractViolationError if response doesn't match the contract
   * @throws Error if API request fails
   */
  public async getAsteroidIds(limit?: number, offset = 0): Promise</* ??? */> {
    // your code here
  }

  /**
   * Fetch a single asteroid by ID from Asteroids API.
   * Validates the response against the asteroids contract (byId endpoint).
   * @param id - Asteroid ID (UUID v7)
   * @returns AsteroidSummary object or null if not found
   * @throws ContractViolationError if response doesn't match the contract
   */
  public async getAsteroidById(id: string): Promise<AsteroidSummary | null> {
    const cacheKey = `${ASTEROIDS_CACHE_KEY_BASE}_${id}`;
    // your code here
  }
}

export const asteroidsService = new AsteroidsService();
