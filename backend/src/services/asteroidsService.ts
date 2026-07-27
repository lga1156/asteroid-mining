/**
 * AsteroidsService - Client for Asteroids API.
 * Fetches asteroid data from Asteroids API.
 * Validates responses against the asteroids contract (contract_asteroids.yaml).
 */

import { ASTEROIDS_API_URL, ASTEROIDS_CACHE_KEY_BASE } from '../config/constants';
import {
    AsteroidAPIResponse,
    AsteroidSummary,
    ContractViolation,
    ContractViolationError,
} from '../types';
import { cacheService } from './cacheService';

export type { AsteroidSummary } from '../types';

const UUID_V7_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateAsteroid(value: unknown, path: string): ContractViolation[] {
    if (!isRecord(value)) {
        return [{ path, message: 'must be an object' }];
    }

    const violations: ContractViolation[] = [];
    if (typeof value.id !== 'string' || !UUID_V7_PATTERN.test(value.id)) {
        violations.push({ path: `${path}.id`, message: 'must be a valid UUID v7' });
    }
    if (typeof value.name !== 'string') {
        violations.push({ path: `${path}.name`, message: 'must be a string' });
    }
    for (const field of ['radius', 'mass'] as const) {
        if (
            typeof value[field] !== 'number' ||
            !Number.isFinite(value[field]) ||
            value[field] < 0
        ) {
            violations.push({ path: `${path}.${field}`, message: 'must be a non-negative number' });
        }
    }

    if (!isRecord(value.coordinates)) {
        violations.push({ path: `${path}.coordinates`, message: 'must be an object' });
    } else {
        for (const field of ['rightAscension', 'declination', 'distance'] as const) {
            if (
                typeof value.coordinates[field] !== 'number' ||
                !Number.isFinite(value.coordinates[field])
            ) {
                violations.push({
                    path: `${path}.coordinates.${field}`,
                    message: 'must be a number',
                });
            }
        }
        if (typeof value.coordinates.distance === 'number' && value.coordinates.distance < 0) {
            violations.push({
                path: `${path}.coordinates.distance`,
                message: 'must be a non-negative number',
            });
        }
    }

    return violations;
}

function validatePage(value: unknown): asserts value is AsteroidAPIResponse {
    if (!isRecord(value)) {
        throw new ContractViolationError([{ path: '$', message: 'must be an object' }]);
    }

    const violations: ContractViolation[] = [];
    if (!Array.isArray(value.items)) {
        violations.push({ path: '$.items', message: 'must be an array' });
    } else {
        value.items.forEach((item, index) => {
            violations.push(...validateAsteroid(item, `$.items[${index}]`));
        });
    }

    for (const field of ['total', 'offset'] as const) {
        if (!Number.isInteger(value[field]) || (value[field] as number) < 0) {
            violations.push({ path: `$.${field}`, message: 'must be a non-negative integer' });
        }
    }
    if (!Number.isInteger(value.limit) || (value.limit as number) < 1) {
        violations.push({ path: '$.limit', message: 'must be a positive integer' });
    }

    if (violations.length > 0) {
        throw new ContractViolationError(violations);
    }
}

function validateSingleAsteroid(value: unknown): asserts value is AsteroidSummary {
    const violations = validateAsteroid(value, '$');
    if (violations.length > 0) {
        throw new ContractViolationError(violations);
    }
}

export class AsteroidsService {
    /**
     * Fetch asteroid IDs from Asteroids API.
     * Validates the response against the asteroids contract (list endpoint).
     * @returns Array of asteroid IDs
     * @throws ContractViolationError if response doesn't match the contract
     * @throws Error if API request fails
     */
    public async getAsteroidIds(limit?: number, offset = 0): Promise<AsteroidAPIResponse> {
        const url = new URL('/asteroids', ASTEROIDS_API_URL);
        if (limit !== undefined) {
            url.searchParams.set('limit', String(limit));
        }
        url.searchParams.set('offset', String(offset));

        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`Asteroids API request failed with status ${response.status}`);
        }

        const data: unknown = await response.json();
        validatePage(data);

        for (const asteroid of data.items) {
            cacheService.set(`${ASTEROIDS_CACHE_KEY_BASE}_${asteroid.id}`, asteroid);
        }

        return data;
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
        const cached = cacheService.get<AsteroidSummary>(cacheKey);
        if (cached) {
            return cached;
        }

        const response = await fetch(`${ASTEROIDS_API_URL}/asteroids/${encodeURIComponent(id)}`);
        if (response.status === 400 || response.status === 404) {
            return null;
        }
        if (!response.ok) {
            throw new Error(`Asteroids API request failed with status ${response.status}`);
        }

        const data: unknown = await response.json();
        validateSingleAsteroid(data);
        cacheService.set(cacheKey, data);
        return data;
    }
}

export const asteroidsService = new AsteroidsService();
