import type {
    AsteroidId,
    AsteroidResponse as DomainAsteroid,
    Resource as DomainResource,
} from '../../../types/domain';

export type AsteroidStatus = DomainAsteroid['status'];

export type AsteroidResource = DomainResource & {
    slug: string;
    symbol: string;
};

export type Asteroid = Omit<DomainAsteroid, 'resources'> & {
    resources: AsteroidResource[];
};

export type AsteroidPage = {
    asteroids: Asteroid[];
    page: number;
    perPage: number;
    total: number;
};

export type { AsteroidId };
