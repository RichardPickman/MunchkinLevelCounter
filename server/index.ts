import { getConfig } from './config/index';
import { createConnection } from './db/index';
import { createWebSocketServer, onClose, onMessage } from './ws'
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

app.prepare().then(async () => {
    const server = createServer((req, res) => handle(req, res, parse(req.url, true)));
    const client = await createConnection(config.db);
    const db = client.db();

    const wss = createWebSocketServer(
        ({ message, ws }) => onMessage({ message, ws, db }),
        ({ ws }) => onClose({ db, ws }),
    );

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
