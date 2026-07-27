/**
 * StatusController - Handle /status WebSocket requests.
 */

import { status } from '../functions/status';
import { STATUS_POLL_INTERVAL } from '../config/constants';
import { Server as HttpServer } from 'node:http';
import { WebSocket, WebSocketServer } from 'ws';

export class StatusController {
    public setupWebSocket({
        server,
        path = '/status',
    }: {
        server: HttpServer;
        path?: string;
    }): WebSocketServer {
        const webSocketServer = new WebSocketServer({ server, path });

        webSocketServer.on('connection', (socket) => {
            let requestInProgress = false;

            const sendSnapshot = async (): Promise<void> => {
                if (requestInProgress || socket.readyState !== WebSocket.OPEN) {
                    return;
                }
                requestInProgress = true;
                try {
                    socket.send(JSON.stringify(await status()));
                } catch (error) {
                    console.error('Unable to send mining status snapshot', error);
                } finally {
                    requestInProgress = false;
                }
            };

            void sendSnapshot();
            const interval = setInterval(() => {
                void sendSnapshot();
            }, STATUS_POLL_INTERVAL);

            const stopPolling = (): void => clearInterval(interval);
            socket.once('close', stopPolling);
            socket.once('error', stopPolling);
        });

        return webSocketServer;
    }
}

export const statusController = new StatusController();
