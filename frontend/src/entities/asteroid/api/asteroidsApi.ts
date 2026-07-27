import {
    createAsteroidId,
    createCubicMeters,
    createIsoDate,
    createKelvin,
    createKilometers,
    createLiters,
    createLunarDistances,
    createMeters,
    createPascals,
    createResourceId,
    createTons,
} from '../../../types/domain';
import { apiRequest } from '../../../shared/api/http';
import { getAsteroidMeta } from '../lib/asteroidMeta';
import type { Asteroid, AsteroidPage, AsteroidResource, AsteroidStatus } from '../model/types';

type RawBaseResource = {
    id: string;
    name: string;
    slug: string;
    symbol: string;
};

type RawResource =
    | (RawBaseResource & {
          kind: 'mineral';
          mass: number;
          superconductingThreshold: number;
      })
    | (RawBaseResource & { kind: 'liquid'; volume: number; volatility: number })
    | (RawBaseResource & { kind: 'gas'; volume: number; volatility: number });

type RawAsteroid = {
    id: string;
    resources: RawResource[];
    status: AsteroidStatus;
};

type RawAsteroidPage = {
    asteroids: RawAsteroid[];
    page?: number;
    perPage?: number;
    total: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function isRawResource(value: unknown): value is RawResource {
    if (
        !isRecord(value) ||
        typeof value.id !== 'string' ||
        typeof value.name !== 'string' ||
        typeof value.slug !== 'string' ||
        typeof value.symbol !== 'string'
    ) {
        return false;
    }

    if (value.kind === 'mineral') {
        return typeof value.mass === 'number' && typeof value.superconductingThreshold === 'number';
    }

    return (
        (value.kind === 'liquid' || value.kind === 'gas') &&
        typeof value.volume === 'number' &&
        typeof value.volatility === 'number'
    );
}

function isAsteroidStatus(value: unknown): value is AsteroidStatus {
    return value === 'available' || value === 'active' || value === 'done';
}

function isRawAsteroid(value: unknown): value is RawAsteroid {
    return (
        isRecord(value) &&
        typeof value.id === 'string' &&
        isAsteroidStatus(value.status) &&
        Array.isArray(value.resources) &&
        value.resources.every(isRawResource)
    );
}

function parseAsteroidPage(value: unknown): RawAsteroidPage {
    if (
        !isRecord(value) ||
        !Array.isArray(value.asteroids) ||
        !value.asteroids.every(isRawAsteroid) ||
        typeof value.total !== 'number'
    ) {
        throw new TypeError('BFF вернул неожиданный формат списка астероидов');
    }

    return {
        asteroids: value.asteroids,
        total: value.total,
        page: typeof value.page === 'number' ? value.page : undefined,
        perPage: typeof value.perPage === 'number' ? value.perPage : undefined,
    };
}

function parseAsteroid(value: unknown): RawAsteroid {
    if (!isRawAsteroid(value)) {
        throw new TypeError('BFF вернул неожиданный формат астероида');
    }

    return value;
}

function mapResource(resource: RawResource): AsteroidResource {
    const base = {
        id: createResourceId(resource.id),
        name: resource.name,
        slug: resource.slug,
        symbol: resource.symbol,
    };

    switch (resource.kind) {
        case 'mineral':
            return {
                ...base,
                kind: resource.kind,
                mass: createTons(resource.mass),
                superconductingThreshold: createKelvin(resource.superconductingThreshold),
            };
        case 'liquid':
            return {
                ...base,
                kind: resource.kind,
                volume: createLiters(resource.volume),
                volatility: createPascals(resource.volatility),
            };
        case 'gas':
            return {
                ...base,
                kind: resource.kind,
                volume: createCubicMeters(resource.volume),
                volatility: createPascals(resource.volatility),
            };
    }
}

function mapAsteroid(rawAsteroid: RawAsteroid): Asteroid {
    const id = createAsteroidId(rawAsteroid.id);
    const meta = getAsteroidMeta(id);

    return {
        id,
        name: meta.name,
        approachDate: createIsoDate(meta.approachDate),
        diameterMeters: createMeters(meta.diameterMeters),
        distanceKm: createKilometers(meta.distanceKm),
        distanceLunar: createLunarDistances(meta.distanceLunar),
        resources: rawAsteroid.resources.map(mapResource),
        status: rawAsteroid.status,
    };
}

export async function fetchAsteroids(page = 10, perPage = 12): Promise<AsteroidPage> {
    const searchParams = new URLSearchParams({ page: String(page), perPage: String(perPage) });
    const rawPage = parseAsteroidPage(await apiRequest(`/asteroids?${searchParams}`));

    return {
        asteroids: rawPage.asteroids.map(mapAsteroid),
        total: rawPage.total,
        page: rawPage.page ?? page,
        perPage: rawPage.perPage ?? perPage,
    };
}

export async function fetchAsteroid(asteroidId: string): Promise<Asteroid> {
    return mapAsteroid(parseAsteroid(await apiRequest(`/asteroids/${asteroidId}`)));
}
