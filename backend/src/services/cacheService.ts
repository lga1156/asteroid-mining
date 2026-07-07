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
    // your code here
  }

  /**
   * Set a value in the cache.
   * @param key - The cache key
   * @param value - The value to cache
   */
  public set<T>(key: string, value: T): void {
    // your code here
  }

  /**
   * Invalidate a cached value by key.
   * @param key - The cache key to invalidate
   */
  public invalidate(key: string): void {
    // your code here
  }

  /**
   * Clear all cached values.
   */
  public clear(): void {
    // your code here
  }
}

// Export singleton instance
export const cacheService = new CacheService();
