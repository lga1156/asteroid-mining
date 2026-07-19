import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import type { MissionStatus, MissionStatusUpdate } from '../../../entities/mission/model/types';
import { useMiningStatusStore } from './miningStatusStore';

const RECONNECT_DELAY_MS = 3_000;

function isMissionStatus(value: unknown): value is MissionStatus {
    return value === 'active' || value === 'done';
}

function isMissionStatusUpdate(value: unknown): value is MissionStatusUpdate {
    if (
        typeof value !== 'object' ||
        value === null ||
        !('id' in value) ||
        typeof value.id !== 'string' ||
        !('status' in value) ||
        !isMissionStatus(value.status) ||
        !('ttl' in value) ||
        typeof value.ttl !== 'number'
    ) {
        return false;
    }

    return (
        !('asteroids' in value) ||
        (Array.isArray(value.asteroids) &&
            value.asteroids.every((asteroidId) => typeof asteroidId === 'string'))
    );
}

function parseMissions(rawMessage: string) {
    const value: unknown = JSON.parse(rawMessage);

    if (!Array.isArray(value) || !value.every(isMissionStatusUpdate)) {
        throw new TypeError('WebSocket вернул неожиданный формат статусов');
    }

    return value;
}

function getWebSocketUrl() {
    if (import.meta.env.VITE_WS_URL) {
        return import.meta.env.VITE_WS_URL;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/status`;
}

export function MiningStatusSync() {
    const queryClient = useQueryClient();
    const statusSignatureRef = useRef('');
    const setConnectionStatus = useMiningStatusStore((state) => state.setConnectionStatus);
    const syncMissions = useMiningStatusStore((state) => state.syncMissions);

    useEffect(() => {
        let socket: WebSocket | undefined;
        let retryTimer: number | undefined;
        let stopped = false;

        const connect = () => {
            setConnectionStatus('connecting');
            socket = new WebSocket(getWebSocketUrl());

            socket.addEventListener('open', () => setConnectionStatus('connected'));
            socket.addEventListener('message', (event) => {
                try {
                    const missions = parseMissions(String(event.data));
                    const statusSignature = missions
                        .map((mission) => `${mission.id}:${mission.status}`)
                        .sort()
                        .join('|');

                    syncMissions(missions);

                    if (statusSignature !== statusSignatureRef.current) {
                        statusSignatureRef.current = statusSignature;
                        void queryClient.invalidateQueries({ queryKey: ['asteroids'] });
                    }
                } catch (error) {
                    console.error(error);
                }
            });
            socket.addEventListener('close', () => {
                if (!stopped) {
                    setConnectionStatus('offline');
                    retryTimer = window.setTimeout(connect, RECONNECT_DELAY_MS);
                }
            });
            socket.addEventListener('error', () => socket?.close());
        };

        // Deferring the initial connection avoids opening a throwaway socket during React StrictMode's probe cycle.
        const startTimer = window.setTimeout(connect, 0);

        return () => {
            stopped = true;
            window.clearTimeout(startTimer);
            window.clearTimeout(retryTimer);
            socket?.close();
        };
    }, [queryClient, setConnectionStatus, syncMissions]);

    return null;
}
