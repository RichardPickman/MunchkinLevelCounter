import { arrayBufferToJSON } from './helpers.mjs';
import { handleAction } from './actions/index.mjs';
import { getDbConfig } from './config/index.mjs';
import { createConnection } from './db/index.mjs';
import { getWebSocketServer } from './ws/index.mjs'
import * as wsCache from './ws/cache.mjs';


const broadcast = (data) => {
    let resultString = JSON.stringify(data);
    data.payload.players.forEach((player) => {                
        const wsPlayer = wsCache.get(player.playerId);

        if (wsPlayer) {
            wsPlayer.send(resultString);
        }
    });
}

const app = async () => {
    const config = getDbConfig();
    const wss = getWebSocketServer()
    const client = await createConnection(config);
    const db = client.db()

    wss.on('connection', ws => {
        ws.on('message', async arrayBuffer => {
            console.log('LOG: Connection established')
            const data = arrayBufferToJSON(arrayBuffer);
            console.log(data);
            if (data && data.playerId && !wsCache.has(playerId)) {
                wsCache.set(playerId, ws)
            }
        })

        ws.on('message', async arrayBuffer => {
            const data = arrayBufferToJSON(arrayBuffer);
    
            if (!data) {
                return console.log("Wrong data: ", arrayBuffer.toString());
            };

            switch (data.action) {
                case 'player/getId': {
                    const payload = await handleAction(data, db, ws);

                    wsCache.set(payload.playerId, ws)
                    ws.send(JSON.stringify({action: data.action, payload}))

                    break
                }
                case 'session/update':
                case 'session/join':
                case 'session/create': {
                    const payload = await handleAction(data, db, ws);

                    broadcast({action: data.action, payload})
                    break
                }
            }
        });
    });
    
    console.log('LOG: Server has been started')
}

app()
