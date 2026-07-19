import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Asteroid } from '../../../entities/asteroid/model/types';
import type {
    MiningResponse,
    Mission,
    MissionStatusUpdate,
} from '../../../entities/mission/model/types';

type ConnectionStatus = 'connecting' | 'connected' | 'offline';

type MiningStatusState = {
    connectionStatus: ConnectionStatus;
    missions: Mission[];
    addMission: (mission: MiningResponse, asteroids: Asteroid[]) => void;
    setConnectionStatus: (connectionStatus: ConnectionStatus) => void;
    syncMissions: (missions: MissionStatusUpdate[]) => void;
};

export const useMiningStatusStore = create<MiningStatusState>()(
    persist(
        (set) => ({
            connectionStatus: 'connecting',
            missions: [],
            addMission: (mission, asteroids) =>
                set((state) => ({
                    missions: [
                        {
                            ...mission,
                            asteroidSnapshots: asteroids,
                            status: 'active',
                            ttl: Date.now() + 60_000,
                        },
                        ...state.missions.filter((item) => item.id !== mission.id),
                    ],
                })),
            setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
            syncMissions: (missions) =>
                set((state) => {
                    const currentById = new Map(
                        state.missions.map((mission) => [mission.id, mission])
                    );
                    const syncedMissions = missions.flatMap((mission): Mission[] => {
                        const currentMission = currentById.get(mission.id);
                        const asteroids = mission.asteroids ?? currentMission?.asteroids;

                        if (!asteroids) {
                            return [];
                        }

                        return [
                            {
                                ...mission,
                                asteroids,
                                asteroidSnapshots: currentMission?.asteroidSnapshots,
                            },
                        ];
                    });
                    const syncedIds = new Set(syncedMissions.map((mission) => mission.id));
                    const localOnlyMissions = state.missions.filter(
                        (mission) => !syncedIds.has(mission.id)
                    );

                    return { missions: [...syncedMissions, ...localOnlyMissions] };
                }),
        }),
        {
            name: 'asteroid-mining-missions',
            partialize: (state) => ({ missions: state.missions }),
        }
    )
);
