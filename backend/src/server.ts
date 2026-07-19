/**
 * Server entry point.
 */

import app from './app';
import { SERVER_PORT, WEBSOCKET_PORT } from './config/constants';
import { statusController } from './controllers/statusController';

import http from 'node:http';

const server = http.createServer(app);

statusController.setupWebSocket({ server, path: '/status' });

app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port ${SERVER_PORT}`);
});

server.listen(WEBSOCKET_PORT, () => {
    console.log(`Websocket server is running on port ${WEBSOCKET_PORT}`);
});
