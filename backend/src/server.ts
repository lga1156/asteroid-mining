/**
 * Server entry point.
 */

import app from './app';
import { SERVER_PORT, WEBSOCKET_PORT } from './config/constants';

import http from 'http';

const server = http.createServer(app);

// где-то здесь нужна настройка WebSocket-сервера 
// он должен быть открыт на порту WEBSOCKET_PORT и пути /status

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}`);
});

server.listen(WEBSOCKET_PORT, () => {
  console.log(`Websocket server is running on port ${WEBSOCKET_PORT}`);
});
