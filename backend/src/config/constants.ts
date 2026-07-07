/**
 * Application constants with environment variable support.
 * All configuration values can be overridden via environment variables.
 */

export const ASTEROIDS_API_URL: string = 'http://51.250.39.129:4001';
export const RESOURCES_API_URL: string = 'http://51.250.39.129:4002';
export const CONCURRENT_REQUEST_LIMIT: number = 5;
export const STATUS_POLL_INTERVAL: number = 5000;
export const MINING_UPDATE_INTERVAL: number = 60000;
export const SERVER_PORT: number = 5678;
export const WEBSOCKET_PORT: number = 5679;
export const ASTEROIDS_CACHE_KEY_BASE: string = 'asteroids';
export const RESOURCES_CACHE_KEY_BASE: string = 'resources';