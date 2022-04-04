

export const reduceSessionId = (sessionId, action) => {
    const { payload, type } = action;

    switch (type) {
        case 'session/create':
        case 'session/join':
            return payload?.sessionId
        default:
            return sessionId;
    }
}

export const reducePlayerId = (playerId, action) => {
    const { type, payload = {} } = action;


    switch (type) {
        case 'session/create':
        case 'session/join': {
            const { players = [] } = payload;

            return playerId || players[players.length - 1]?.playerId;
        }
        default:
            return playerId;
    }
}

export const reducePlayers = (players, action) => {
    const { type, payload } = action;

    switch (type) {
        case 'session/create':
        case 'session/join': {
            return payload?.players ?? []
        }
        case 'session/update': {
            if (payload.players) {
                return [...payload.players]
            }

            return players.map(player => ({
                ...player,
                ...(payload.playerId === player.playerId ? omit(action.payload, ['sessionId', 'playerId']) : {})
            }));
        }
        default:
            return [...players];
    }
};

export const reducer = (state, action) => {
    return {
        playerId: reducePlayerId(state.playerId, action),
        sessionId: reduceSessionId(state.sessionId, action),
        players: reducePlayers(state.players, action)
    }
}

const omit = (obj, props) => {
    const result = {};
    const keys = Object.keys(obj);

    keys.forEach(key => {
        if (props.indexOf(key) === -1) {
            result[key] = obj[key];
        }
    })

    return result;
}