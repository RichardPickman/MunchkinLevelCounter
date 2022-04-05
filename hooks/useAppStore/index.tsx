import { Dispatch, useReducer } from "react";
import { reducer } from "./reducer";
import * as Types from '../../types'

interface State {
    sessionId: Types.SessionId,
    playerId: Types.PlayerId,
    players: Types.Player[],
}


function getInititalState(): State {
    return {
        playerId: null,
        sessionId: null,
        players: [],
    }
}


export const useAppStore = (): [ State, Dispatch<any> ] => useReducer(reducer, getInititalState())
