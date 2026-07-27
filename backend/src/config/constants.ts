/**
 * Application constants with environment variable support.
 * All configuration values can be overridden via environment variables.
 */

function stringFromEnv(name: string, fallback: string): string {
    const value = process.env[name]?.trim();
    return value || fallback;
}

function nonNegativeIntegerFromEnv(name: string, fallback: number): number {
    const rawValue = process.env[name];
    if (rawValue === undefined || rawValue.trim() === '') {
        return fallback;
    }
    const value = Number(rawValue);
    return Number.isInteger(value) && value >= 0 ? value : fallback;
}

function positiveIntegerFromEnv(name: string, fallback: number): number {
    const value = nonNegativeIntegerFromEnv(name, fallback);
    return value > 0 ? value : fallback;
}

export const ASTEROIDS_API_URL = stringFromEnv('ASTEROIDS_API_URL', 'http://51.250.39.129:4001');
export const RESOURCES_API_URL = stringFromEnv('RESOURCES_API_URL', 'http://51.250.39.129:4002');
export const CONCURRENT_REQUEST_LIMIT = positiveIntegerFromEnv('CONCURRENT_REQUEST_LIMIT', 5);
export const STATUS_POLL_INTERVAL = positiveIntegerFromEnv('STATUS_POLL_INTERVAL', 5000);
export const MINING_UPDATE_INTERVAL = nonNegativeIntegerFromEnv('MINING_UPDATE_INTERVAL', 60000);
export const SERVER_PORT = positiveIntegerFromEnv('SERVER_PORT', 5678);
export const WEBSOCKET_PORT = positiveIntegerFromEnv('WEBSOCKET_PORT', 5679);
export const ASTEROIDS_CACHE_KEY_BASE = stringFromEnv('ASTEROIDS_CACHE_KEY_BASE', 'asteroids');
export const RESOURCES_CACHE_KEY_BASE = stringFromEnv('RESOURCES_CACHE_KEY_BASE', 'resources');
