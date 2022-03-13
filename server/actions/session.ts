import { createPlayer } from "./helpers";
import { getSessionId } from "../helpers";
import { insertSession, getSession, insertPlayer, updateSessionState } from "../resolvers/index";


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
    
    if (session) {
        return await updateSession({ sessionId, playerId, isActive: true }, db)
    }

    const result = await insertPlayer({ sessionId }, player, db)

    return result
}

export const updateSession = ({ sessionId, playerId, ...changes }, db) => updateSessionState({ sessionId, playerId, ...changes }, db)
