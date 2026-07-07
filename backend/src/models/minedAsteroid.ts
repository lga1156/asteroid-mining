/**
 * MinedAsteroid model interface.
 * Represents a mined asteroid with an ID and foreign key to mining.
 */

export interface MinedAsteroid {
  id: string;
  mining_id: string;
}
