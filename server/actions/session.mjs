import { createPlayer } from "./helpers.mjs";
import { getSessionId, getUpdateFields, getPlayerId} from "../helpers.mjs";


const getSession = async ({ sessionId, playerId }, db) => {
    const result = await db.collection('sessions').findOne({ 
        sessionId, 
        players: { $elemMatch: { playerId } } 
    });

    return result
};

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

export const joinSession = async ({ sessionId, playerId }, db) => {
    const session = await getSession({ sessionId, playerId }, db)
    
    if (session) {
        return updateSession({ 
            sessionId,
            playerId,
            isInside: true,
        }, db) 
    }

    const result = await db.collection('sessions').findOneAndUpdate(
        { sessionId }, 
        { $push: { players: createPlayer(playerId) }},
        { returnDocument: 'after'}
    );

    return result.value
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

