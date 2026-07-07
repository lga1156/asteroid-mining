/**
 * ResourcesService - Client for Resources API.
 * Fetches asteroid details from Resources API.
 * Validates responses against the composition contract (contract_composition.yaml).
 */

import { RESOURCES_API_URL, RESOURCES_CACHE_KEY_BASE } from '../config/constants';
import {  Element } from '../types';
import { cacheService } from './cacheService';

export class ResourcesService {
  /**
   * Fetch asteroid details from Resources API.
   * Validates the response against the composition contract.
   * @param id - Asteroid ID
   * @returns XML string response (validated)
   * @throws ContractViolationError if response doesn't match the contract
   * @throws Error if API request fails
   */
  public async getAsteroidDetails(id: string): Promise<string> {
    const cacheKey = `${RESOURCES_CACHE_KEY_BASE}_${id}`;
    // your code here
  }
  /**
   * Fetch asteroid details from Resources API.
   * Validates the response against the composition contract.
   * @param id - Asteroid ID
   * @returns XML string response (validated)
   * @throws ContractViolationError if response doesn't match the contract
   * @throws Error if API request fails
   */
  public async getElementsList(): Promise<Element[]> {
    const cacheKey = `${RESOURCES_CACHE_KEY_BASE}_list`;
    // your code here
  }
}

export const resourcesService = new ResourcesService();
