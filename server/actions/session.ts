import { createPlayer } from "./helpers";
import { getSessionId } from "../helpers";
import { insertSession, getSession, insertPlayer, updateSessionState } from "../resolvers/index";
import { getIdentifier } from "./player";


export const createSession = async (data, db) => {
    const handlePlayer = (data.playerId === null) ? await getIdentifier() : data.playerId
    const player =  createPlayer(handlePlayer.playerId, true)
    let sessionId = getSessionId()
    const session = {
        sessionId,
        startTime: new Date(),
        players: [player],
    }
    
    await insertSession(session, db)
    
    console.log(player)
    
    return session
}

export const joinSession = async ({ sessionId, playerId }, db) => {
    const player = (playerId === null) ? (await getIdentifier()).playerId : playerId
    const session = await getSession({ sessionId, player }, db)
    
    if (session) {
        return await updateSession({ sessionId, playerId, isActive: true }, db)
    }

    const result = await insertPlayer({ sessionId }, player, db)

    return result
}

export const updateSession = ({ sessionId, playerId, ...changes }, db) => updateSessionState({ sessionId, playerId, ...changes }, db)
