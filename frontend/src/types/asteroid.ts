export interface Asteroid {
    id: string;
    name: string;
    approachDate: string;
    diameterMeters: number;
    distanceKm: number;
    distanceLunar: number;
    resources: Resource[];
}

export interface Resource {
    id: string;
    name: string;
    mass?: number;
    volume?: number;
    volatility?: number;
    superconductingThreshold?: number;
}
