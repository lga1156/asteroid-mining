/**
 * AsteroidsController - Handle /asteroids requests.
 */

import { Request, Response, NextFunction } from 'express';
import { asteroidsService } from '../services/asteroidsService';
import { resourcesService } from '../services/resourcesService';
import { xmlService } from '../services/xmlService';
import { cacheService } from '../services/cacheService';
import { statusById } from '../functions/statusById';
import { Asteroid, AsteroidStatus } from '../types';
import { ASTEROIDS_CACHE_KEY_BASE, CONCURRENT_REQUEST_LIMIT } from '../config/constants';


export class AsteroidsController {
  public async getAsteroids(req: Request, res: Response, next: NextFunction) {
    // your code here

  }
}

export const asteroidsController = new AsteroidsController();
