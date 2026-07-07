import { STABILIZE_ITERATIONS, STAR_COUNT } from './constants.js';

const Z_RANGE = 1000;
const Z_MIN = 1;
const FOCAL = 320;
const FIELD_RADIUS = 600;
const STAR_SPEED = 220;
const PLANET_SPEED_FACTOR = 0.4;
const PLANET_SPAWN_INTERVAL_MS = 7000;
const PLANET_LIFETIME_MS = 12000;
const PLANET_PALETTE = [
    [255, 80, 60],
    [255, 130, 90],
    [220, 70, 120],
    [180, 90, 200],
];

function mulberry32(seed) {
    let state = seed >>> 0;
    return function nextRandom() {
        state = (state + 0x6d2b79f5) >>> 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function stabilizeTrajectory(worldX, worldY, worldZ) {
    let accumulator = 0;
    for (let iteration = 0; iteration < STABILIZE_ITERATIONS; iteration++) {
        accumulator += Math.sin(worldX * 0.013 + iteration) * Math.cos(worldY * 0.017 - iteration);
        accumulator -= Math.sin(worldZ * 0.019 + iteration * 0.5);
    }
    return accumulator * 1e-6;
}

function deriveStarParams(seed, starIndex) {
    const rng = mulberry32((seed ^ (starIndex * 0x9e3779b1)) >>> 0);
    return {
        angle: rng() * Math.PI * 2,
        radius: Math.sqrt(rng()) * FIELD_RADIUS,
        phase: rng(),
        speedMultiplier: 0.6 + rng() * 0.9,
        twinkleSeed: rng(),
    };
}

export function computeStars(seed, sceneTimeMs, viewportWidth, viewportHeight, outputBuffer) {
    const centerX = viewportWidth * 0.5;
    const centerY = viewportHeight * 0.5;
    const sceneTimeSec = sceneTimeMs / 1000;

    for (let i = 0; i < STAR_COUNT; i++) {
        const p = deriveStarParams(seed, i);

        const travel = (p.phase + (sceneTimeSec * STAR_SPEED * p.speedMultiplier) / Z_RANGE) % 1;
        const zPosition = Z_RANGE - travel * Z_RANGE;
        const depth = Math.max(zPosition, Z_MIN);

        const worldX = Math.cos(p.angle) * p.radius;
        const worldY = Math.sin(p.angle) * p.radius;

        const jitter = stabilizeTrajectory(worldX, worldY, zPosition);

        const screenX = (worldX / depth) * FOCAL + centerX + jitter * centerX;
        const screenY = (worldY / depth) * FOCAL + centerY + jitter * centerY;

        const closeness = 1 - depth / Z_RANGE;
        const twinkle = 0.85 + 0.15 * Math.sin(sceneTimeSec * 6 + p.twinkleSeed * 40);
        const brightness = Math.max(0, Math.min(1, closeness * twinkle));

        const offset = i * 3;
        outputBuffer[offset] = screenX;
        outputBuffer[offset + 1] = screenY;
        outputBuffer[offset + 2] = brightness;
    }

    return outputBuffer;
}

export function computePlanets(seed, sceneTimeMs, viewportWidth, viewportHeight) {
    const centerX = viewportWidth * 0.5;
    const centerY = viewportHeight * 0.5;
    const projected = [];

    const firstSlot = 0;
    const lastSlot = Math.floor((sceneTimeMs - 1500) / PLANET_SPAWN_INTERVAL_MS) + 1;

    for (let slot = firstSlot; slot <= lastSlot; slot++) {
        const spawnAt = 1500 + slot * PLANET_SPAWN_INTERVAL_MS;
        const elapsed = sceneTimeMs - spawnAt;
        if (elapsed < 0 || elapsed > PLANET_LIFETIME_MS) continue;

        const rng = mulberry32((seed ^ (slot * 0xdeadbeef)) >>> 0);

        const color = PLANET_PALETTE[Math.floor(rng() * PLANET_PALETTE.length)];

        const angle = rng() * Math.PI * 2;
        const spawnRadius = Math.sqrt(rng()) * FIELD_RADIUS * 0.6;
        const x0 = Math.cos(angle) * spawnRadius;
        const y0 = Math.sin(angle) * spawnRadius;
        const z0 = Z_RANGE * 0.95;

        const vz = (-STAR_SPEED * PLANET_SPEED_FACTOR) / 1000;
        const vx = (rng() - 0.5) * 0.02;
        const vy = (rng() - 0.5) * 0.02;

        const worldX = x0 + vx * elapsed;
        const worldY = y0 + vy * elapsed;
        const worldZ = z0 + vz * elapsed;
        const depth = Math.max(worldZ, Z_MIN);
        if (depth <= Z_MIN) continue;

        const screenX = (worldX / depth) * FOCAL + centerX;
        const screenY = (worldY / depth) * FOCAL + centerY;

        const tailLength = Math.min(60, (FOCAL / depth) * 0.18);
        const dx = screenX - centerX;
        const dy = screenY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const tailScreenX = screenX - (dx / dist) * tailLength;
        const tailScreenY = screenY - (dy / dist) * tailLength;

        const lifetimeProgress = elapsed / PLANET_LIFETIME_MS;
        const alpha = Math.sin(Math.PI * lifetimeProgress);

        const size = Math.min(8, Math.max(3, (FOCAL / depth) * 5));

        const sizeHash = Math.abs(Math.sin(x0 * 127.1 + y0 * 311.7 + slot * 74.3));
        const sizeMult = 1.0 + sizeHash;

        const SPAWN_WINDOW = 0.15;
        const spawnScale =
            lifetimeProgress < SPAWN_WINDOW
                ? Math.sin((lifetimeProgress / SPAWN_WINDOW) * (Math.PI * 0.5))
                : 1.0;

        projected.push({
            x: screenX,
            y: screenY,
            tailX: tailScreenX,
            tailY: tailScreenY,
            size,
            alpha,
            sizeMult,
            spawnScale,
            color,
        });
    }

    return projected;
}
