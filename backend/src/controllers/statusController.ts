/**
 * StatusController - Handle /status WebSocket requests.
 */

import { status } from '../functions/status';
import { STATUS_POLL_INTERVAL } from '../config/constants';

export class StatusController {
  public setupWebSocket({server, path}: {server: any, path?: string}) {
    // your code here
  }
}

export const statusController = new StatusController();
