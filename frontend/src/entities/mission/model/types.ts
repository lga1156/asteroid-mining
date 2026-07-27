import type { Asteroid } from '../../asteroid/model/types';

export type MissionStatus = 'active' | 'done';

export type Mission = {
    asteroidSnapshots?: Asteroid[];
    asteroids: string[];
    id: string;
    status: MissionStatus;
    ttl: number;
};

export type MissionStatusUpdate = Omit<Mission, 'asteroidSnapshots' | 'asteroids'> & {
    asteroids?: string[];
};

export type MiningResponse = {
    asteroids: string[];
    id: string;
};
