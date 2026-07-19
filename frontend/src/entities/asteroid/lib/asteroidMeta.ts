import type { AsteroidId } from '../model/types';

const DAY_MS = 24 * 60 * 60 * 1000;
const BASE_APPROACH_DATE = Date.UTC(2026, 6, 1);

function hashId(id: string) {
    let hash = 2166136261;

    for (const character of id) {
        hash ^= character.charCodeAt(0);
        hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
}

export function getAsteroidMeta(id: AsteroidId) {
    const hash = hashId(id);
    const prefix = id.slice(0, 4).toUpperCase();
    const suffix = id.slice(-4).toUpperCase();

    return {
        name: `AMC ${prefix}–${suffix}`,
        approachDate: new Date(BASE_APPROACH_DATE + (hash % 180) * DAY_MS)
            .toISOString()
            .slice(0, 10),
        diameterMeters: 24 + (hash % 477),
        distanceKm: 280_000 + (hash % 14_000_000),
        distanceLunar: Number((0.7 + (hash % 370) / 10).toFixed(1)),
        imageVariant: hash % 4,
    };
}

export function getAsteroidImageVariant(id: AsteroidId) {
    return getAsteroidMeta(id).imageVariant;
}
