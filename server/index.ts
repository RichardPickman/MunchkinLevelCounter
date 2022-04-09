import { getConfig } from './config/index';
import { createConnection } from './db/index';
import { WebSocketServer } from 'ws';
import { onClose, onMessage } from './ws'
import { createServer } from 'http'
import { parse } from 'url'
import next from 'next';


const config = getConfig();
const app = next({
    dev: process.env.NODE_ENV !== 'production',
    hostname: config.ws.address,
    port: config.ws.port,
})
const handle = app.getRequestHandler()

const wsCache = new Map();

app.prepare().then(async () => {
    const server = createServer((req, res) => handle(req, res, parse(req.url, true)));
    const wss = new WebSocketServer({ noServer: true });

    const client = await createConnection(config.db);
    const db = client.db();

    wss.on('connection', ws => {
        ws.on('close', () => onClose(wsCache, db, ws))
        ws.on('message', arrayBuffer => onMessage(arrayBuffer, wsCache, ws, db));
    });

    server.on('upgrade', (req, socket, head) => {
        const { pathname } = parse(req.url, true);
        if (pathname !== '/_next/webpack-hmr') {
            wss.handleUpgrade(req, socket, head, function done(ws) {
                wss.emit('connection', ws, req);
            });
        }
    });

    server.listen(config.ws.port, () => console.log(`Ready!`))
});
