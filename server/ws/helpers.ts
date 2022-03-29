
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
