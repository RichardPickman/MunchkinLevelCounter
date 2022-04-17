import { Dispatch, useReducer } from "react";
import { reducer } from "./reducer";
import * as Types from '../../types'

interface State {
    sessionId: Types.SessionId,
    playerId: Types.PlayerId,
    nickname: Types.Nickname,
    players: Types.Player[],
    // error: any,
}


function getInititalState(): State {
    return {
        playerId: null,
        sessionId: null,
        nickname: '',
        players: [],
    }
}


export const useAppStore = (): [State, Dispatch<any>] => useReducer(reducer, getInititalState())
