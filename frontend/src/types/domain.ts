import type { components } from './openapi.generated';
import { unsafeBrand, type Branded, type Unbranded } from './brand';

export type AsteroidId = Branded<string, 'AsteroidId'>;
export type ResourceId = Branded<string, 'ResourceId'>;
export type MiningId = Branded<string, 'MiningId'>;
export type IsoDate = Branded<string, 'IsoDate'>;
export type Meters = Branded<number, 'Meters'>;
export type Kilometers = Branded<number, 'Kilometers'>;
export type LunarDistances = Branded<number, 'LunarDistances'>;
export type Tons = Branded<number, 'Tons'>;
export type Liters = Branded<number, 'Liters'>;
export type CubicMeters = Branded<number, 'CubicMeters'>;
export type Kelvin = Branded<number, 'Kelvin'>;
export type Pascals = Branded<number, 'Pascals'>;

function createNonEmptyId<Brand extends 'AsteroidId' | 'ResourceId' | 'MiningId'>(
    value: Unbranded<string>,
    brand: Brand
): Branded<string, Brand> {
    if (value.trim().length === 0) {
        throw new TypeError(`${brand} cannot be empty`);
    }
    return unsafeBrand(value, brand);
}

function createNonNegative<Brand extends string>(
    value: Unbranded<number>,
    brand: Brand
): Branded<number, Brand> {
    if (!Number.isFinite(value) || value < 0) {
        throw new RangeError(`${brand} must be a finite non-negative number`);
    }
    return unsafeBrand(value, brand);
}

export const createAsteroidId = (value: Unbranded<string>) => createNonEmptyId(value, 'AsteroidId');
export const createResourceId = (value: Unbranded<string>) => createNonEmptyId(value, 'ResourceId');
export const createMiningId = (value: Unbranded<string>) => createNonEmptyId(value, 'MiningId');

export function createIsoDate(value: Unbranded<string>): IsoDate {
    const date = new Date(`${value}T00:00:00Z`);
    const isValid =
        /^\d{4}-\d{2}-\d{2}$/.test(value) &&
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value;

    if (!isValid) {
        throw new TypeError('IsoDate must use YYYY-MM-DD format and contain a valid date');
    }
    return unsafeBrand(value, 'IsoDate');
}

export const createMeters = (value: Unbranded<number>) => createNonNegative(value, 'Meters');
export const createKilometers = (value: Unbranded<number>) =>
    createNonNegative(value, 'Kilometers');
export const createLunarDistances = (value: Unbranded<number>) =>
    createNonNegative(value, 'LunarDistances');
export const createTons = (value: Unbranded<number>) => createNonNegative(value, 'Tons');
export const createLiters = (value: Unbranded<number>) => createNonNegative(value, 'Liters');
export const createCubicMeters = (value: Unbranded<number>) =>
    createNonNegative(value, 'CubicMeters');
export const createKelvin = (value: Unbranded<number>) => createNonNegative(value, 'Kelvin');
export const createPascals = (value: Unbranded<number>) => createNonNegative(value, 'Pascals');

type Schemas = components['schemas'];
type WithResourceId<Resource extends Schemas['BaseResource']> = Omit<Resource, 'id'> & {
    id: ResourceId;
};

type RefineResource<GeneratedResource extends Schemas['Resource']> = GeneratedResource extends {
    kind: 'mineral';
}
    ? Omit<WithResourceId<GeneratedResource>, 'mass' | 'superconductingThreshold'> & {
          mass: Tons;
          superconductingThreshold: Kelvin;
      }
    : GeneratedResource extends { kind: 'liquid' }
      ? Omit<WithResourceId<GeneratedResource>, 'volume' | 'volatility'> & {
            volume: Liters;
            volatility: Pascals;
        }
      : GeneratedResource extends { kind: 'gas' }
        ? Omit<WithResourceId<GeneratedResource>, 'volume' | 'volatility'> & {
              volume: CubicMeters;
              volatility: Pascals;
          }
        : WithResourceId<GeneratedResource>;

export type Resource = RefineResource<Schemas['Resource']>;
export type MineralResource = Extract<Resource, { kind: 'mineral' }>;
export type LiquidResource = Extract<Resource, { kind: 'liquid' }>;
export type GasResource = Extract<Resource, { kind: 'gas' }>;

export type Asteroid = Omit<
    Schemas['Asteroid'],
    'id' | 'approachDate' | 'diameterMeters' | 'distanceKm' | 'distanceLunar' | 'resources'
> & {
    id: AsteroidId;
    approachDate: IsoDate;
    diameterMeters: Meters;
    distanceKm: Kilometers;
    distanceLunar: LunarDistances;
    resources: Resource[];
};

export type AsteroidResponse = Asteroid & Pick<Schemas['AsteroidResponse'], 'status'>;

export type ApiError = Schemas['Error'];
export type ApiResult<Value> = { ok: true; data: Value } | { ok: false; error: ApiError };

export type MiningRequest = Omit<Schemas['MiningRequest'], 'asteroids'> & {
    asteroids: AsteroidId[];
};

export type MiningResponse = Omit<Schemas['MiningResponse'], 'id' | 'asteroids'> & {
    id: MiningId;
    asteroids: AsteroidId[];
};
