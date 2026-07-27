/**
 * CacheService - Runtime caching service using JavaScript Map.
 * Provides get, set, invalidate, and clear operations.
 */

export class CacheService {
    private cache: Map<string, unknown> = new Map();

    /**
     * Get a cached value by key.
     * @param key - The cache key
     * @returns The cached value or undefined
     */
    public get<T>(key: string): T | undefined {
        return this.cache.get(key) as T | undefined;
    }

    /**
     * Set a value in the cache.
     * @param key - The cache key
     * @param value - The value to cache
     */
    public set<T>(key: string, value: T): void {
        this.cache.set(key, value);
    }

    /**
     * Invalidate a cached value by key.
     * @param key - The cache key to invalidate
     */
    public invalidate(key: string): void {
        this.cache.delete(key);
    }

    public clear(): void {
        this.cache.clear();
    }
}

export const cacheService = new CacheService();
