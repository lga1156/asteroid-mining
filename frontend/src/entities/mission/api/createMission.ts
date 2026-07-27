import { apiRequest } from '../../../shared/api/http';
import type { MiningResponse } from '../model/types';

function parseMiningResponse(value: unknown): MiningResponse {
    if (
        typeof value !== 'object' ||
        value === null ||
        !('id' in value) ||
        typeof value.id !== 'string' ||
        !('asteroids' in value) ||
        !Array.isArray(value.asteroids) ||
        !value.asteroids.every((asteroidId) => typeof asteroidId === 'string')
    ) {
        throw new TypeError('BFF вернул неожиданный ответ при запуске миссии');
    }

    return { id: value.id, asteroids: value.asteroids };
}

export async function createMission(asteroids: string[]) {
    return parseMiningResponse(
        await apiRequest('/mine', {
            method: 'POST',
            body: JSON.stringify({ asteroids }),
        })
    );
}
