/**
 * MineController - Handle /mine requests.
 */

import { Request, Response } from 'express';
import { createMining } from '../functions/createMining';
import { statusById } from '../functions/statusById';
import { cacheService } from '../services/cacheService';
import { asteroidsService } from '../services/asteroidsService';

export class MineController {
  public async createMining(req: Request, res: Response) {
    // your code here
  }
}

export const mineController = new MineController();
