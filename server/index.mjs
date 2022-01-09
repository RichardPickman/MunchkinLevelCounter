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
        
        const playerId = getPlayerId()
        wsCache.set(playerId, ws)
        ws.on('message', async arrayBuffer => {
            console.log('LOG: Connection established')
            const data = arrayBufferToJSON(arrayBuffer);
            console.log(data);
    
            if (!data) {
                return console.log("Wrong data: ", arrayBuffer.toString());
            };

            // HANDLE NEW PLAYER AND JSON RESPONSE 
            if (data.storageId){
                const playerId = getPlayerId()

                wsCache.set(playerId, ws)

                let wsPlayer = wsCache.get(playerId)
                let resultString = JSON.stringify({ playerId })

                console.log(resultString)
                
                if (wsPlayer) {
                    wsPlayer.send(resultString);
                }
            } else {
                let result = await handleAction(data, client);
                let resultString = JSON.stringify(result);

                result.players.forEach((player) => {                
                    const wsPlayer = wsCache.get(player.playerId);

                    if (wsPlayer) {
                        wsPlayer.send(resultString);
                    }
                });
            }
            
        });
    
        // ws.send(JSON.stringify({ playerId }));
    });
    
    console.log('LOG: Server has been started')
}

app()
