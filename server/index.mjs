import { arrayBufferToJSON } from './helpers.mjs';
import { handleAction } from './actions/index.mjs';
import { getConfig } from './config/index.mjs';
import { getSessionByPlayerId, getSessionBySessionId } from './resolvers/index.mjs';
import { createConnection } from './db/index.mjs';
import { WebSocketServer } from 'ws';

import { createServer } from 'http'
import { parse } from 'url'
import next from 'next';

const config = getConfig();
const dev = process.env.NODE_ENV !== 'production'
const hostname = config.ws.address
const port = config.ws.port
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

const wsCache  = new Map();

const broadcast = (data) => {
    let resultString = JSON.stringify(data);
    const payload = data.payload
    payload.players.forEach((player) => {
        const wsPlayer = wsCache.get(player.playerId)
        const result = JSON.stringify({ action: 'session/update', payload })

        wsPlayer && !player.isActive && wsPlayer.send(resultString)
        wsPlayer && player.isActive && wsPlayer.send(result)
    });
};


app.prepare().then(async () => {
    const server = createServer((req, res) => handle(req, res, parse(req.url, true)))
    const wss = new WebSocketServer({ noServer: true })
    
    const client = await createConnection(config.db);
    const db = client.db();
    
    const getWebSocketsBySessionId = async (sessionId) => {
        const players = await getSessionBySessionId(db, sessionId)
        const wsPlayers = []
        
        for (let [, value] of Object.entries(players)) {
            wsCache.has(value.playerId) && wsPlayers.push(value.playerId)
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
                        action: 'session/exit', 
                        payload: { playerId, sessionId }
                    }, db);
                    const hasActivePlayers = payload.players.some(elem => elem.isActive)
                    
                    if (hasActivePlayers) broadcast({ action: 'session/exit', payload })
                    
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
                    break
                }
                case 'session/update':
                case 'session/join':
                case 'session/create':
                case 'session/exit': {
                    const payload = await handleAction(data, db, ws);

                    broadcast({action: data.action, payload})
                    break
                }
            }
        });
    });

    console.log('LOG: Server has been started')

    server.on('upgrade', function (req, socket, head) {
        const { pathname } = parse(req.url, true);
        if (pathname !== '/_next/webpack-hmr') {
            wss.handleUpgrade(req, socket, head, function done(ws) {
                wss.emit('connection', ws, req);
            });
        }
    });

    server.listen(port, (err) => {
        if (err) throw err
        console.log(`Ready on http://${hostname}:${port} and ws://localhost:${port}`)
    })
})




