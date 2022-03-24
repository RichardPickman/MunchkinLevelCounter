const prompt = require('prompt');
const WebSocket = require('ws');
const { config } = require('dotenv');

config()

function createPlayers(amountPlayers) {
    const players = new Array(amountPlayers).fill(null);

    for (let i = 0; i < amountPlayers; i++) {
        const player = Math.floor(Math.random() * 1000000);
        players[i] = player;
    }

    return players;
}


function setConnection(playerId, sessionId) {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_HOST);
    const template = {
        action: 'session/join',
        payload: { playerId, sessionId }
    };

    ws.onopen = () => {
        ws.send(JSON.stringify(template))
    }
}

prompt.start()

prompt.get(['sessionId', 'players'], function (err, result) {
    const create = createPlayers(result.players)

    create.forEach(player => {
        setConnection(player, result.sessionId)
    })


  });