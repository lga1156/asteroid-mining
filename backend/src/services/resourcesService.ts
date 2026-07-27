/**
 * ResourcesService - Client for Resources API.
 * Fetches asteroid details from Resources API.
 * Validates responses against the composition contract (contract_composition.yaml).
 */

import { XMLValidator } from 'fast-xml-parser';
import {
    CONCURRENT_REQUEST_LIMIT,
    RESOURCES_API_URL,
    RESOURCES_CACHE_KEY_BASE,
} from '../config/constants';
import { ContractViolation, ContractViolationError, Element } from '../types';
import { cacheService } from './cacheService';
import { xmlService } from './xmlService';

class RequestLimiter {
    private activeRequests = 0;
    private readonly waiting: Array<() => void> = [];

    public constructor(private readonly limit: number) {}

    public async run<T>(operation: () => Promise<T>): Promise<T> {
        await this.acquire();
        try {
            return await operation();
        } finally {
            this.release();
        }
    }

    private async acquire(): Promise<void> {
        if (this.activeRequests < this.limit) {
            this.activeRequests += 1;
            return;
        }
        await new Promise<void>((resolve) => this.waiting.push(resolve));
    }

    private release(): void {
        const next = this.waiting.shift();
        if (next) {
            next();
        } else {
            this.activeRequests -= 1;
        }
    }
}

const requestLimiter = new RequestLimiter(CONCURRENT_REQUEST_LIMIT);

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateElements(value: unknown): asserts value is Element[] {
    if (!Array.isArray(value)) {
        throw new ContractViolationError([{ path: '$', message: 'must be an array' }]);
    }

    const violations: ContractViolation[] = [];
    value.forEach((element, index) => {
        const path = `$[${index}]`;
        if (!isRecord(element)) {
            violations.push({ path, message: 'must be an object' });
            return;
        }
        for (const field of ['name', 'symbol', 'slug'] as const) {
            if (typeof element[field] !== 'string' || element[field].length === 0) {
                violations.push({
                    path: `${path}.${field}`,
                    message: 'must be a non-empty string',
                });
            }
        }
        if (!['mineral', 'liquid', 'gas'].includes(String(element.kind))) {
            violations.push({ path: `${path}.kind`, message: 'must be mineral, liquid, or gas' });
        }
    });

    if (violations.length > 0) {
        throw new ContractViolationError(violations);
    }
}

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
        const cached = cacheService.get<string>(cacheKey);
        if (cached !== undefined) {
            return cached;
        }

        return requestLimiter.run(async () => {
            const cachedAfterWaiting = cacheService.get<string>(cacheKey);
            if (cachedAfterWaiting !== undefined) {
                return cachedAfterWaiting;
            }

            const response = await fetch(
                `${RESOURCES_API_URL}/composition/${encodeURIComponent(id)}`
            );
            if (!response.ok) {
                throw new Error(`Resources API request failed with status ${response.status}`);
            }

            const xml = await response.text();
            const validationResult = XMLValidator.validate(xml);
            if (validationResult !== true || !/<(?:[\w-]+:)?cml(?:\s|\/?>)/u.test(xml)) {
                throw new ContractViolationError([
                    { path: '$', message: 'must be a valid CML document' },
                ]);
            }

            const parsedResources = xmlService.parse(xml);
            cacheService.set(`${cacheKey}_parsed`, parsedResources);
            cacheService.set(cacheKey, xml);
            return xml;
        });
    }

    public async getElementsList(): Promise<Element[]> {
        const cacheKey = `${RESOURCES_CACHE_KEY_BASE}_list`;
        const cached = cacheService.get<Element[]>(cacheKey);
        if (cached) {
            return cached;
        }

        return requestLimiter.run(async () => {
            const cachedAfterWaiting = cacheService.get<Element[]>(cacheKey);
            if (cachedAfterWaiting) {
                return cachedAfterWaiting;
            }

            const response = await fetch(`${RESOURCES_API_URL}/elements`);
            if (!response.ok) {
                throw new Error(`Resources API request failed with status ${response.status}`);
            }

            const data: unknown = await response.json();
            validateElements(data);
            cacheService.set(cacheKey, data);
            return data;
        });
    }
}

export const resourcesService = new ResourcesService();
