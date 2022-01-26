import { arrayBufferToJSON } from './helpers.mjs';
import { handleAction } from './actions/index.mjs';
import { getConfig } from './config/index.mjs';
import { createConnection } from './db/index.mjs';
import { WebSocketServer } from 'ws';

const wsCache = new Map();

const broadcast = (data) => {
    let resultString = JSON.stringify(data);
    const payload = data.payload
    data.payload.players.forEach((player) => {    
        const wsPlayer = wsCache.get(player.playerId)
        const result = JSON.stringify({ action: 'session/update', payload })

        wsPlayer && !player.isActive && wsPlayer.send(resultString)
        !wsPlayer && !player.isActive && console.log('Player deactivated')
        
        wsPlayer && player.isActive && wsPlayer.send(result)
    });
}

const app = async () => {
    const config = getConfig();
    const wss = new WebSocketServer(config.ws);
    const client = await createConnection(config.db);
    const db = client.db();
    let session;

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
            const cachedSocket = cacheItems.find(([key, value]) => value === ws);
            const [playerId] = cachedSocket || [];

            if (!playerId) {
                console.log('socket was not cached');
                return;
            }
            
            wsCache.delete(playerId);

            setTimeout( async function () {
                if (!wsCache.has(playerId)) {
                    const payload = await handleAction({ 
                        action: 'session/exit', 
                        payload: { 
                            playerId, 
                            sessionId: session 
                        }}, db, ws);

                    broadcast({ action: 'session/exit', payload })
                }
            }, 1000*5)

            
            console.log(playerId, 'removed from cache due to closed connection');

        });

        ws.on('message', cacheIt);

        ws.on('message', async arrayBuffer => {
            const data = arrayBufferToJSON(arrayBuffer);

            if (!data) {
                return console.log("Wrong data: ", arrayBuffer.toString());
            };

            switch (data.action) {
                case 'player/getId': {
                    const payload = await handleAction(data, db, ws);

                    ws.send(JSON.stringify({action: data.action, payload}))

                    break
                }
                case 'session/update':
                case 'session/join':
                case 'session/create':
                case 'session/exit': {
                    const payload = await handleAction(data, db, ws);
                    session = payload.sessionId

                    broadcast({action: data.action, payload})
                    break
                }
            }
        });
    });
    
    console.log('LOG: Server has been started')
}

app()
