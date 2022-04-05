export const reduceSessionId = (sessionId, action) => {
    const { payload, type } = action;

    switch (type) {
        case 'session/create':
        case 'session/join':
            return payload.sessionId
        case 'session/exit':
            return null
        default:
            return sessionId;
    }
}

export const reducePlayerId = (playerId, action) => {
    const { type, payload } = action;

    switch (type) {
        case 'session/create':
        case 'session/join': 
            return payload.players[payload.players.length - 1].playerId;
        default:
            return playerId;
    }
}

export const reducePlayers = (players, action) => {
    const { type, payload } = action;

    switch (type) {
        case 'session/create':
        case 'session/join': 
        case 'session/update': 
            return [...payload.players]
        case 'session/exit':
            return []
        default:
            return players;
    }
};

export const reducer = (state, action) => ({
        playerId: reducePlayerId(state.playerId, action),
        sessionId: reduceSessionId(state.sessionId, action),
        players: reducePlayers(state.players, action)
});
