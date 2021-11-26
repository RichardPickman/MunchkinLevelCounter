import { WebSocketServer } from 'ws';
import { config } from 'dotenv';

import { arrayBufferToJSON, getPlayerId } from './helpers.mjs';
import { handleAction } from './actions/index.mjs';
import { createConnection } from './db.mjs';


config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const wss = new WebSocketServer({ port: 8080 });
const playerToWsMap = {};


const app = async () => {
    const client = await createConnection(uri);

    wss.on('connection', ws => {
    
        const playerId = getPlayerId()
        playerToWsMap[playerId] = ws
        
        ws.on('message', async arrayBuffer => {
            const data = arrayBufferToJSON(arrayBuffer);
    
            if (!data) {
                return console.log("Wrong data: ", arrayBuffer.toString());
            };
    
            let result = await handleAction(data, client);
    

            result.players.forEach((player) => {
                if (player.playerId in playerToWsMap) { playerToWsMap[player.playerId].send(JSON.stringify(result))}
            });
            
        });
    
        ws.send(JSON.stringify({ playerId }));
    });
}

app()
