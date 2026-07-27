import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Asteroid, AsteroidId } from '../../../entities/asteroid/model/types';

type MissionPlanState = {
    asteroids: Asteroid[];
    addAsteroid: (asteroid: Asteroid) => void;
    clear: () => void;
    removeAsteroid: (asteroidId: AsteroidId) => void;
    removeAsteroids: (asteroidIds: AsteroidId[]) => void;
};

export const useMissionPlanStore = create<MissionPlanState>()(
    persist(
        (set) => ({
            asteroids: [],
            addAsteroid: (asteroid) =>
                set((state) =>
                    state.asteroids.some((item) => item.id === asteroid.id)
                        ? state
                        : { asteroids: [...state.asteroids, asteroid] }
                ),
            clear: () => set({ asteroids: [] }),
            removeAsteroid: (asteroidId) =>
                set((state) => ({
                    asteroids: state.asteroids.filter((asteroid) => asteroid.id !== asteroidId),
                })),
            removeAsteroids: (asteroidIds) => {
                const asteroidIdSet = new Set(asteroidIds);
                set((state) => ({
                    asteroids: state.asteroids.filter(
                        (asteroid) => !asteroidIdSet.has(asteroid.id)
                    ),
                }));
            },
        }),
        { name: 'asteroid-mining-mission-plan' }
    )
);
