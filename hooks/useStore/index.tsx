import { Dispatch, useReducer } from "react";
import { useWebSocket } from "../useWebSocket";
import * as Types from '../../types'
import { reducer } from "./reducer";


function getInititalState() {
    return {
        playerId: null,
        sessionId: null,
        players: [],
        startTime: null
    }
}

export const useStore = (url?: string): [
        state: {
            sessionId: Types.SessionId,
            playerId: Types.PlayerId,
            players: Types.Player[],
        },
        dispatch: Dispatch<any>,
    ] => {
    const [state, dispatch] = useReducer(reducer, getInititalState())
    const ws = useWebSocket(url, message => dispatch(message))

    const dispatchRemoteAction = (action) => {
        ws.send(action)
        dispatch(action)
    }


    return [
        state,
        dispatchRemoteAction,
    ]
}
