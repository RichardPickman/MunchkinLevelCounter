import { getPlayerId, getSessionId, createPlayer } from "../../helpers";
import { insertSession, getSession, insertPlayer, updateSessionState } from "../resolvers/index";


export const createSession = async ({ playerId = null } = {}, db) => {
    const player = createPlayer(playerId, true)
    const sessionId = getSessionId()
    const session = {
        sessionId,
        startTime: new Date(),
        players: [player],
    }

    await insertSession(session, db)

    return session
}

export const joinSession = async ({ sessionId, playerId }, db) => {
    const player = createPlayer(playerId || getPlayerId())

    const session = await getSession({
        sessionId,
        playerId: player.playerId
    }, db)

    if (session) {
        return await updateSession({
            sessionId,
            playerId: player.playerId,
            isActive: true
        }, db);
    }

    const result = await insertPlayer({ sessionId }, player, db)

    return result
}

export const updateSession = ({ sessionId, playerId, ...changes }, db) => updateSessionState({ sessionId, playerId, ...changes }, db)

export const exitSession = ({ sessionId, playerId }, db) => updateSessionState({ sessionId, playerId, isActive: false }, db)
