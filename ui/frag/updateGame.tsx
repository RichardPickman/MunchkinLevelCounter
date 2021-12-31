

export function updateSession(props) {
    const GAME_PAYLOAD = {
        action: "update",
        payload: { 
            ...props.game
        }
    }

    return GAME_PAYLOAD
}

export function joinSession(props) {
    const GAME_PAYLOAD = {
        action: "join",
        payload: { 
            playerId: props.game.playerId,
            sessionId: props.game.sessionId
        }
    }

    return GAME_PAYLOAD
}

export function createSession(props) {
    const GAME_PAYLOAD = {
        action: "create",
            payload: { 
                playerId: props.playerId 
            }
        }

    return GAME_PAYLOAD
}