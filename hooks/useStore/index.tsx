import { useReducer } from "react";
import { useWebSocket } from "../useWebSocket";


function getPlayerById(players, id) {
    return players.find(player => player.playerId === id)
}

function getInititalState() {
    return {
        playerId: null,
        sessionId: null,
        players: [],
        startTime: null
    }
}

function reducer(state, action) {
    const { type, payload: newSession } = action;
    const { playerId, isActive } = getPlayerById(newSession.players, state.playerId) || newSession.players[newSession.players.length - 1];

    switch (type) {
        case 'session/create':
        case 'session/join':
            return {
                ...state,
                ...newSession,
                playerId,
            }
        case 'session/update': {
            return {
                ...state,
                players: isActive ? newSession.players : [],
                sessionId: isActive ? newSession.sessionId : null
            }
        }
    }

    return state;
}

export function useStore() {
    const [state, dispatch] = useReducer(reducer, getInititalState())
    const ws = useWebSocket('ws://localhost:8080', message => dispatch(message))

    const dispatchRemoteAction = (action) => {
        ws.send(action)

        if (action === 'session/create' || action === 'session/join') {
            return
        } else {
            dispatch(action)
        }
    }


    return {
        state,
        dispatchRemoteAction
    }
}
