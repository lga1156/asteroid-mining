import type { Asteroid } from '../entities/asteroid/model/types';
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
} from '../types/domain';

export const asteroidFixture: Asteroid = {
    id: createAsteroidId('018f0000-0000-7000-8000-000000000001'),
    name: 'Психея',
    approachDate: createIsoDate('2026-08-10'),
    diameterMeters: createMeters(226.4),
    distanceKm: createKilometers(41_200),
    distanceLunar: createLunarDistances(107.2),
    status: 'available',
    resources: [
        {
            id: createResourceId('iron'),
            kind: 'mineral',
            mass: createTons(420),
            name: 'Железо',
            slug: 'iron',
            superconductingThreshold: createKelvin(12),
            symbol: 'Fe',
        },
        {
            id: createResourceId('water'),
            kind: 'liquid',
            name: 'Вода',
            slug: 'water',
            symbol: 'H₂O',
            volatility: createPascals(611),
            volume: createLiters(800),
        },
        {
            id: createResourceId('helium'),
            kind: 'gas',
            name: 'Гелий',
            slug: 'helium',
            symbol: 'He',
            volatility: createPascals(200),
            volume: createCubicMeters(50),
        },
    ],
};
