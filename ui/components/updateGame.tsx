

export function updateSession(props) {
    const GAME_PAYLOAD = {
        action: "update",
        payload: { 
            ...props
        }
    }

    return GAME_PAYLOAD
}

export function joinSession(props) {
    const GAME_PAYLOAD = {
        action: "join",
        payload: { 
            playerId: props.playerId,
            sessionId: props.sessionId
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