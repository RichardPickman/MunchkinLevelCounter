import prompt from 'prompt';
import WebSocket from 'ws';

import { getConfig } from '../../server/config';

const config = getConfig()

function createPlayers(amountPlayers) {
    const players = new Array(amountPlayers).fill(null);

    for (let i = 0; i < amountPlayers; i++) {
        const player = Math.floor(Math.random() * 1000000);
        players[i] = player;
    }

    return players;
}


function setConnection(playerId, sessionId) {
    console.log(playerId, sessionId)
    const ws = new WebSocket(config.bots.address);
    const template = {
        type: 'session/join',
        payload: { playerId, sessionId }
    };

    ws.onopen = () => {
        ws.send(JSON.stringify(template));
    }
}

prompt.start()

prompt.get(['sessionId', 'players'], function (err, result) {
    const create = createPlayers(result.players);
    console.log(create)

    create.forEach(player => {
        setConnection(player, result.sessionId);
    })
});