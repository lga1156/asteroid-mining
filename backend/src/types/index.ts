/**
 * TypeScript type definitions for the asteroid mining application.
 */

// Здесь могут быть более широкие типы, чем в задании по типизации
// Внимательно следите за соответствием типизации на бэкенде и фронтенде

export type BaseResource = {
  id: string;
  name: string; // Human-readable name
  slug: string; // Unique slug
  symbol: string; // Short name
};

export type MineralResource = BaseResource & {
  kind: 'mineral';
  mass: number; // Tons
  superconductingThreshold: number; // Temperature, Kelvin
};

export type LiquidResource = BaseResource & {
  kind: 'liquid';
  volume: number; // Liters
  volatility: number; // Pascals. At what pressure the liquid can evaporate (be lost, but rare to mine)
};

export type GasResource = BaseResource & {
  kind: 'gas';
  volume: number; // Cubic meters
  volatility: number; // Pascals. At what pressure the gas molecularly decomposes
};

export type Resource = MineralResource | LiquidResource | GasResource | any;

export type Asteroid = {
  id: string;
  resources: Resource[];
};

export type MiningStatus = 'active' | 'done';

export type AsteroidStatus = 'active' | 'done' | 'available';

export interface Mining {
  id: string;
  status: MiningStatus;
  ttl: number;
}

export interface MinedAsteroid {
  id: string;
  mining_id: string;
}

export interface MiningRequest {
  asteroids: string[];
}

export interface MiningResponse {
  id: string;
  asteroids: string[];
}

export interface AsteroidResponse extends Asteroid {
  status: AsteroidStatus;
}

export interface ContractViolation {
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  violations: ContractViolation[];
}

export class ContractViolationError extends Error {
  public readonly violations: ContractViolation[];

  constructor(violations: ContractViolation[]) {
    const details = violations.map((v: { path: string; message: string }) => `${v.path}: ${v.message}`).join('; ');
    super(`Contract violation: ${details}`);
    this.name = 'ContractViolationError';
    this.violations = violations;
  }
}

export interface Element {
  name: string;
  symbol: string;
  slug: string;
  kind: "mineral" | "liquid" | "gas"
}

export interface AsteroidAPIResponse {
  items: Asteroid[];
  total: number;
  limit: number;
  offset: number;
}