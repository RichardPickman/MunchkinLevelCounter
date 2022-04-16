import { getPlayerId, getSessionId, createPlayer } from "../../helpers";
import { insertSession, getSession, insertPlayer, updateSessionState } from "../resolvers/index";


export const createSession = async ({ playerId = null, nickname = '' } = {}) => {
    const player = createPlayer(playerId, nickname, true)
    const sessionId = getSessionId()
    const session = {
        sessionId,
        startTime: new Date(),
        players: [player],
    }

    await insertSession(session)

    return session
}

export const joinSession = async ({ sessionId, playerId, nickname }) => {
    const player = createPlayer(playerId || getPlayerId(), nickname)

    const session = await getSession({
        sessionId,
        playerId: player.playerId
    })

    if (session) {
        return await updateSession({
            sessionId,
            playerId: player.playerId,
            isActive: true
        });
    }

    const result = await insertPlayer({ sessionId }, player)

    return result
}

export const updateSession = ({ sessionId, playerId, ...changes }) => updateSessionState({ sessionId, playerId, ...changes })

export const exitSession = ({ sessionId, playerId }) => updateSessionState({ sessionId, playerId, isActive: false })
