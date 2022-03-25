import { Player } from '../../types'

export const broadcast = (websockets: WebSocket[], data: any) => {
    let result = JSON.stringify(data);
    websockets.forEach((websocket) => websocket.send(result));
};

export const getWebSocketsBySession = (wsCache, { players }) => {
    const websockets = [];

    players.forEach(player => {
        if (wsCache.has(player.playerId)) {
            websockets.push(wsCache.get(player.playerId));
        }
    })

    return websockets;
};
