import type { components } from '../types/openapi.generated';
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
    type AsteroidResponse,
    type Resource,
} from '../types/domain';

const RAW_ASTEROIDS = [
    {
        id: '2021277',
        name: '21277 (1996 TO5)',
        approachDate: '2026-07-12',
        diameterMeters: 480,
        distanceKm: 4_210_000,
        distanceLunar: 10.9,
        status: 'available',
        resources: [
            {
                kind: 'mineral',
                id: 'ni-fe-core',
                name: 'Никель-железное ядро',
                mass: 820_000,
                superconductingThreshold: 8.1,
            },
            {
                kind: 'mineral',
                id: 'cobalt-veins',
                name: 'Кобальтовые жилы',
                mass: 92_000,
                superconductingThreshold: 7.2,
            },
            {
                kind: 'gas',
                id: 'hydrogen-cloud',
                name: 'Облако молекулярного водорода',
                volume: 1_900_000,
                volatility: 0.98,
            },
        ],
    },
    {
        id: '3542519',
        name: '(2010 PK9)',
        approachDate: '2026-07-14',
        diameterMeters: 95,
        distanceKm: 730_000,
        distanceLunar: 1.9,
        status: 'active',
        resources: [
            {
                kind: 'liquid',
                id: 'water-ice',
                name: 'Водяной лед',
                volume: 24_000,
                volatility: 0.71,
            },
            {
                kind: 'liquid',
                id: 'ammonia-pockets',
                name: 'Аммиачные карманы',
                volume: 6_300,
                volatility: 0.84,
            },
            {
                kind: 'gas',
                id: 'helium-3-plume',
                name: 'Шлейф гелия-3',
                volume: 410_000,
                volatility: 0.96,
            },
        ],
    },
    {
        id: '3729681',
        name: '(2015 RC1)',
        approachDate: '2026-07-18',
        diameterMeters: 32,
        distanceKm: 5_900_000,
        distanceLunar: 15.3,
        status: 'available',
        resources: [
            {
                kind: 'mineral',
                id: 'platinum-dust',
                name: 'Платиновая пыль',
                mass: 740,
                superconductingThreshold: 6.7,
            },
            {
                kind: 'mineral',
                id: 'silicate-regolith',
                name: 'Силикатный реголит',
                mass: 12_400,
                superconductingThreshold: 12.6,
            },
            {
                kind: 'gas',
                id: 'xenon-traces',
                name: 'Следы ксенона',
                volume: 72_000,
                volatility: 0.88,
            },
        ],
    },
    {
        id: '54016072',
        name: '(2020 SO)',
        approachDate: '2026-07-22',
        diameterMeters: 12,
        distanceKm: 290_000,
        distanceLunar: 0.75,
        status: 'done',
        resources: [
            {
                kind: 'mineral',
                id: 'aluminum-fragments',
                name: 'Алюминиевые фрагменты',
                mass: 1_400,
                superconductingThreshold: 4.8,
            },
            {
                kind: 'mineral',
                id: 'titanium-lattice',
                name: 'Титановая решетка',
                mass: 260,
                superconductingThreshold: 11.4,
            },
            {
                kind: 'gas',
                id: 'argon-capsule',
                name: 'Аргоновая капсула',
                volume: 9_800,
                volatility: 0.91,
            },
        ],
    },
    {
        id: '3837600',
        name: '(2018 VP1)',
        approachDate: '2026-07-29',
        diameterMeters: 220,
        distanceKm: 11_400_000,
        distanceLunar: 29.6,
        status: 'available',
        resources: [
            {
                kind: 'mineral',
                id: 'rare-earth-mix',
                name: 'Смесь редкоземельных металлов',
                mass: 36_000,
                superconductingThreshold: 9.8,
            },
            {
                kind: 'liquid',
                id: 'methane-hydrates',
                name: 'Метановые гидраты',
                volume: 14_800,
                volatility: 0.93,
            },
            {
                kind: 'gas',
                id: 'carbon-monoxide-geyser',
                name: 'Гейзер угарного газа',
                volume: 680_000,
                volatility: 0.95,
            },
        ],
    },
    {
        id: '54275816',
        name: '(2023 DW)',
        approachDate: '2026-08-03',
        diameterMeters: 64,
        distanceKm: 2_780_000,
        distanceLunar: 7.2,
        status: 'available',
        resources: [
            {
                kind: 'mineral',
                id: 'iridium-needles',
                name: 'Иридиевые иглы',
                mass: 2_900,
                superconductingThreshold: 7.4,
            },
            {
                kind: 'liquid',
                id: 'brine-lenses',
                name: 'Солевые линзы',
                volume: 17_600,
                volatility: 0.62,
            },
            {
                kind: 'gas',
                id: 'neon-caverns',
                name: 'Неоновые каверны',
                volume: 128_000,
                volatility: 0.89,
            },
        ],
    },
    {
        id: '3981884',
        name: '(2020 BX12)',
        approachDate: '2026-08-09',
        diameterMeters: 165,
        distanceKm: 8_450_000,
        distanceLunar: 22,
        status: 'available',
        resources: [
            {
                kind: 'mineral',
                id: 'palladium-grains',
                name: 'Палладиевые зерна',
                mass: 11_200,
                superconductingThreshold: 5.9,
            },
            {
                kind: 'liquid',
                id: 'ethanol-frost',
                name: 'Этаноловый иней',
                volume: 5_400,
                volatility: 0.79,
            },
            {
                kind: 'gas',
                id: 'nitrogen-pocket',
                name: 'Азотный карман',
                volume: 350_000,
                volatility: 0.94,
            },
        ],
    },
    {
        id: '54339865',
        name: '(2024 KU3)',
        approachDate: '2026-08-16',
        diameterMeters: 310,
        distanceKm: 13_200_000,
        distanceLunar: 34.3,
        status: 'available',
        resources: [
            {
                kind: 'mineral',
                id: 'magnetite-layer',
                name: 'Магнетитовый слой',
                mass: 58_000,
                superconductingThreshold: 8.7,
            },
            {
                kind: 'liquid',
                id: 'sulfuric-reservoir',
                name: 'Сернокислотный резервуар',
                volume: 31_000,
                volatility: 0.67,
            },
            {
                kind: 'gas',
                id: 'krypton-vault',
                name: 'Криптоновое хранилище',
                volume: 92_000,
                volatility: 0.97,
            },
        ],
    },
] satisfies components['schemas']['AsteroidResponse'][];

function toResource(resource: components['schemas']['Resource']): Resource {
    switch (resource.kind) {
        case 'mineral':
            return {
                ...resource,
                id: createResourceId(resource.id),
                mass: createTons(resource.mass),
                superconductingThreshold: createKelvin(resource.superconductingThreshold),
            };
        case 'liquid':
            return {
                ...resource,
                id: createResourceId(resource.id),
                volume: createLiters(resource.volume),
                volatility: createPascals(resource.volatility),
            };
        case 'gas':
            return {
                ...resource,
                id: createResourceId(resource.id),
                volume: createCubicMeters(resource.volume),
                volatility: createPascals(resource.volatility),
            };
    }
}

function toAsteroid(asteroid: components['schemas']['AsteroidResponse']): AsteroidResponse {
    return {
        ...asteroid,
        id: createAsteroidId(asteroid.id),
        approachDate: createIsoDate(asteroid.approachDate),
        diameterMeters: createMeters(asteroid.diameterMeters),
        distanceKm: createKilometers(asteroid.distanceKm),
        distanceLunar: createLunarDistances(asteroid.distanceLunar),
        resources: asteroid.resources.map(toResource),
    };
}

export const SAMPLE_ASTEROIDS = RAW_ASTEROIDS.map(toAsteroid);
