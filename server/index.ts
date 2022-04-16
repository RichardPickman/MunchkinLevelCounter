import { createServer } from 'http';

import { getServerConfig } from './config/index';
import { createWebSocketServer } from './ws';
import { onClose, onMessage } from './ws';


const { host, port } = getServerConfig();

const server = createServer();
const wss = createWebSocketServer(onMessage, onClose);

server.on('upgrade', (req, socket, head) => wss.handleUpgrade(req, socket, head, ws => wss.emit('connection', ws, req)));

server.listen(port, () => console.log(`Ready at ${host}:${port}`))
