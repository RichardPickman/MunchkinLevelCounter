export const reduceSessionId = (sessionId, action) => {
    const { payload, type } = action;

    switch (type) {
        case 'session/create':
        case 'session/join':
        case 'sessionId/set':
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
            return playerId || payload.players[payload.players.length - 1].playerId;
        default:
            return playerId;
    }
}

export const reduceNickname = (nickname, action) => {
    const { type, payload } = action;

    switch (type) {
        case 'nickname/set':
            return payload.nickname;
        default:
            return nickname;
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
        case 'session/error':
            return []
        default:
            return players;
    }
};

export const reducer = (state, action) => ({
    playerId: reducePlayerId(state.playerId, action),
    sessionId: reduceSessionId(state.sessionId, action),
    nickname: reduceNickname(state.nickname, action),
    players: reducePlayers(state.players, action),
});
