import prompt from 'prompt';
import WebSocket from 'ws';
import { arrayBufferToJSON } from '../../server/helpers';

import { getServerConfig } from '../../server/config';

const config = getServerConfig()

function setConnection(sessionId) {
    const ws = new WebSocket(`ws://${config.host}:${config.port}`);

    ws.onopen = () => {
        ws.send(
            JSON.stringify({
                type: 'session/join',
                payload: { sessionId }
            })
        );
    }

    ws.on('message', function onMessage(message) {
        const { payload } = arrayBufferToJSON(message)
        const player = payload?.players[payload?.players.length - 1]

        console.log(`\x1b[32m${player?.playerId}\x1b[0m has joined to ${payload?.sessionId}`)

        ws.off('message', onMessage)
    })
}

prompt.start()

prompt.get(['sessionId', 'playersCount'], function (err, result) {
    for (let i = 0; i < result.playersCount; i++) {
        setConnection(result.sessionId);
    }
});
