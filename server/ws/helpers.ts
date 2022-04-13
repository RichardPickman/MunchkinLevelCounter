import { WebSocket } from 'ws';

export const broadcast = (websockets: WebSocket[], data: any) => {
    let result = JSON.stringify(data);
    websockets.forEach((websocket) => websocket.send(result));
};

export const getWebSocketsBySession = (cache, { players }) => {
    const websockets = [];

    players.forEach(player => {
        if (cache.has(player.playerId)) {
            websockets.push(cache.get(player.playerId));
        }
    })

    return websockets;
};

export const cacheIt = (action, session, cache, ws) => {
    if (action === 'session/create' || action === 'session/join') {
        const player = session.players[session.players.length - 1];

        cache.set(player.playerId, ws);
    }
}
