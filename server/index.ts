
import { arrayBufferToJSON } from '../helpers';
import { handleAction } from './actions/index';
import { getConfig } from './config/index';
import { getSessionByPlayerId } from './resolvers/index';
import { createConnection } from './db/index';
import { WebSocketServer } from 'ws';
import { getWebSocketsBySession, broadcast } from './ws/helpers';

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
        ws.on('close', () => {
            const cacheItems = Array.from(wsCache.entries());
            const cachedSocket = cacheItems.find(([, value]) => value === ws);
            const [playerId] = cachedSocket || [];

            if (!playerId) return console.log('socket was not cached');

            wsCache.delete(playerId);

            // Delete if player hasn't connected to game with same id
            setTimeout(async function () {
                if (!wsCache.has(playerId)) {
                    const session = await getSessionByPlayerId({ playerId }, db);
                    const payload = await handleAction({
                        type: 'session/update',
                        payload: {
                            playerId,
                            sessionId: session.sessionId,
                            isActive: false
                        }
                    }, db);

                    const websockets = getWebSocketsBySession(wsCache, payload);

                    if (websockets) {
                        broadcast(websockets, {
                            type: 'session/update',
                            payload,
                        })
                    }

                }
            }, 1000 * 5)

            console.log(playerId, 'removed from cache due to closed connection');

        });

        ws.on('message', async arrayBuffer => {
            const action = arrayBufferToJSON(arrayBuffer);

            if (!action) {
                console.log("Wrong action: ", arrayBuffer.toString());
                return;
            };

            const session = await handleAction(action, db);
            const websockets = getWebSocketsBySession(wsCache, session).filter(websocket => websocket !== ws);

            if (action.type === 'session/create' || action.type === 'session/join') {
                const player = session.players[session.players.length - 1];

                wsCache.set(player.playerId, ws);
            }

            broadcast([ws], { type: action.type, payload: session });
            broadcast(websockets, { type: 'session/update', payload: session });

        });
    });

    server.on('upgrade', function (req, socket, head) {
        const { pathname } = parse(req.url, true);
        if (pathname !== '/_next/webpack-hmr') {
            wss.handleUpgrade(req, socket, head, function done(ws) {
                wss.emit('connection', ws, req);
            });
        }
    });

    server.listen(config.ws.port, () => {
        console.log(`Ready!`)
    })
})




