
import { arrayBufferToJSON } from './helpers';
import { handleAction } from './actions/index';
import { getConfig } from './config/index';
import { getSessionByPlayerId } from './resolvers/index';
import { createConnection } from './db/index';
import { WebSocketServer } from 'ws';
import { Player } from '../types'

import { createServer } from 'http'
import { parse } from 'url'
import next from 'next';


const config = getConfig();
const dev: boolean = process.env.NODE_ENV !== 'production'
const hostname: string = config.ws.address
const port: number = config.ws.port
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

const wsCache  = new Map();

const broadcast = (data: any, websockets: WebSocket[]) => {
    let result = JSON.stringify(data);
    websockets.forEach((websocket) => websocket.send(result));
};

app.prepare().then(async () => {
    const server = createServer((req, res) => handle(req, res, parse(req.url, true)))
    const wss = new WebSocketServer({ noServer: true })
    
    const client = await createConnection(config.db);
    const db = client.db();
    
    const getWebSocketsBySession = async (session) => {
        const wsPlayers = []
        
        for (let [, value] of Object.entries<Player>(session.players)) {
            wsCache.has(value.playerId) && wsPlayers.push(wsCache.get(value.playerId))
        }
        
        return wsPlayers
    };
    
    wss.on('connection', ws => {
        const cacheIt = async arrayBuffer => {
            const data = arrayBufferToJSON(arrayBuffer);
            const payload = data.payload || {};
            const { playerId } = payload;

            console.log('LOG: Connection established')

            if (playerId && !wsCache.has(playerId)) {
                console.log('cached as', playerId);
                wsCache.set(playerId, ws);
                ws.off('message', cacheIt);
            }
        }

        ws.on('close', () => {
            const cacheItems = Array.from(wsCache.entries());
            const cachedSocket = cacheItems.find(([, value]) => value === ws);
            const [playerId] = cachedSocket || [];

            if (!playerId) return console.log('socket was not cached');
            
            wsCache.delete(playerId);

            // Delete if player hasn't connected to game with same id
            setTimeout(async function () {
                if (!wsCache.has(playerId)) {
                    const sessionId = await getSessionByPlayerId({ playerId }, db);
                    const payload = await handleAction({ 
                        action: 'session/update', 
                        payload: { playerId, sessionId, isActive: false }
                    }, db);
                    
                    const hasActivePlayers = await getWebSocketsBySession(payload)
                    
                    if (hasActivePlayers) broadcast({ action: 'session/update', payload }, hasActivePlayers)
                    
                }
            }, 1000*5)

            console.log(playerId, 'removed from cache due to closed connection');

        });

        ws.on('message', cacheIt);

        ws.on('message', async arrayBuffer => {
            const data = arrayBufferToJSON(arrayBuffer);

            if (!data) return console.log("Wrong data: ", arrayBuffer.toString());

            switch (data.action) {
                case 'player/getId': {
                    const payload = await handleAction(data, db);

                    ws.send(JSON.stringify({action: data.action, payload}))

                    break;
                }
                case 'session/update':
                case 'session/join':
                case 'session/create':{
                    const payload = await handleAction(data, db);
                    const wsList = await getWebSocketsBySession(payload)

                    broadcast({action: data.action, payload}, wsList)

                    break;
                }
            }
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

    server.listen(port, () => {
        console.log(`Ready on http://${hostname}:${port} and ws://localhost:${port}`)
    })
})




