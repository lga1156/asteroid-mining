/**
 * Mining model interface.
 * Represents a mining operation with an ID and status.
 */

export interface Mining {
    id: string; // id of the mining operation
    ttl: number; // finish time in milliseconds (timestamp)
    status: 'active' | 'done'; // mining status
}
