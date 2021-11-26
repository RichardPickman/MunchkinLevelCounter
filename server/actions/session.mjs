import { createPlayer } from "./helpers.mjs";
import { getSessionId, getUpdateFields} from "../helpers.mjs"


export const createSession = async ({ playerId }, client) => {
    const player = createPlayer(playerId, true);
    let sessionId = getSessionId()
    const session = {
        sessionId,
        startTime: new Date(),
        players: [player],
    }

    const result = await client.db().collection('sessions').insertOne(session);// session._id // insertedId === ObjectId

    return result.insertedId ? session : null 
}

export const joinSession = async ({ sessionId, playerId }, client) => {
    const player = createPlayer(playerId)

    const { value: session } = await client.db().collection('sessions').findOneAndUpdate(
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

export const updateSession = async (data, client) => {
    let { sessionId, playerId, ...changes } = data
    const result = await client.db().collection('sessions').findOneAndUpdate(
        { sessionId },
        { $set: getUpdateFields(changes) },
        { 
            arrayFilters: [{ "elem.playerId": playerId }],
            returnDocument: 'after',   
        }
    );

    return result.value
};