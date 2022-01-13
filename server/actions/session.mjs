import { createPlayer } from "./helpers.mjs";
import { getSessionId, getUpdateFields, getPlayerId} from "../helpers.mjs"
import * as wsCache from '../ws/cache.mjs';


export const createSession = async (data, db) => {
    const player = createPlayer(data.playerId, true);
    let sessionId = getSessionId()
    const session = {
        sessionId,
        startTime: new Date(),
        players: [player],
    }

    const result = await db.collection('sessions').insertOne(session);

    return result.insertedId ? session : null 
}

export const joinSession = async ({ sessionId, playerId}, db) => {
    const player = createPlayer(playerId)

    const { value: session } = await db.collection('sessions').findOneAndUpdate(
        { sessionId }, 
        {
            $push: {
                players: player
            }
        },
        { returnDocument: 'after', }
    );

    return session
}

export const updateSession = async ({ sessionId, playerId, ...changes }, db) => {
    const result = await db.collection('sessions').findOneAndUpdate(
        { sessionId },
        { $set: getUpdateFields(changes) },
        { 
            arrayFilters: [{ "elem.playerId": playerId }],
            returnDocument: 'after',   
        }
    );
    
    return result.value
};
 
export const getIdentifier = async () => {
    const player = getPlayerId()
    const result = { playerId: player }

    return result
};