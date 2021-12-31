import { arrayBufferToJSON, getPlayerId } from './helpers.mjs';
import { handleAction } from './actions/index.mjs';
import { getDbConfig } from './config/index.mjs';

import { createConnection } from './db/index.mjs';
import { getWebSocketServer } from './ws/index.mjs'
import * as wsCache from './ws/cache.mjs';



const app = async () => {
    const config = getDbConfig();
    const wss = getWebSocketServer()
    const client = await createConnection(config);

    wss.on('connection', ws => {

        console.log('Connected')
        
        const playerId = getPlayerId()
        wsCache.set(playerId, ws)

        ws.on('message', async arrayBuffer => {
            const data = arrayBufferToJSON(arrayBuffer);
            console.log(data);
    
            if (!data) {
                return console.log("Wrong data: ", arrayBuffer.toString());
            };
            
            let result = await handleAction(data, client);
            const resultString = JSON.stringify(result);

            result.players.forEach((player) => {                
                const wsPlayer = wsCache.get(player.playerId);

                if (wsPlayer) {
                    wsPlayer.send(resultString);
                }
            });
            
        });
    
        ws.send(JSON.stringify({ playerId }));
    });
}

app()
