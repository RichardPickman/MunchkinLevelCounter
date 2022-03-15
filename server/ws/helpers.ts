import { Player } from '../../types'

export const broadcast = (websockets: WebSocket[], data: any) => {
    let result = JSON.stringify(data);
    websockets.forEach((websocket) => websocket.send(result));
};

export const getWebSocketsBySession = (wsCache, { players }) => {
    const wsPlayers = []

    players.forEach(player => {
        wsCache.has(player.playerId) && wsPlayers.push(wsCache.get(player.playerId))
    })

    return wsPlayers
};