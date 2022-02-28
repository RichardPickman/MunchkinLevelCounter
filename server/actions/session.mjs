import { createPlayer } from "./helpers.mjs";
import { getSessionId } from "../helpers.mjs";
import { insertSession, getSession, insertPlayer, updateSessionState } from "../resolvers/index.mjs";


export const createSession = async (data, db) => {
    const player = createPlayer(data.playerId, true);
    let sessionId = getSessionId()
    const session = {
        sessionId,
        startTime: new Date(),
        players: [player],
    }

    await insertSession(session, db)

    return session
}

export const joinSession = async ({ sessionId, playerId }, db) => {
    const session = await getSession({ sessionId, playerId }, db)
    const player = createPlayer(playerId)
    
    if (session) return await updateSession({ sessionId, playerId, isActive: true }, db)

    const result = await insertPlayer({ sessionId }, player, db)

    return result
}

export const updateSession = async ({ sessionId, playerId, ...changes }, db) => await updateSessionState({ sessionId, playerId, ...changes }, db)

export const exitSession = async ({ sessionId, playerId }, db) => await updateSession({ sessionId, playerId, isActive: false }, db)
