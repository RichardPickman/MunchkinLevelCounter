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

const joinSession = async ({ sessionId, playerId }, db) => {
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
    console.log('Player do not exist. Creating one')

    return session
}

const getSession = async ({ sessionId, playerId }, db) => {
    const check = await db.collection('sessions').findOne(
            { sessionId, players: { $elemMatch: { playerId } } }
        );

    const result = await db.collection('sessions').findOneAndUpdate(
        { sessionId },
        { $set: getUpdateFields({isInside: true}) },
        { 
            arrayFilters: [{ "elem.playerId": playerId }],
            returnDocument: 'after',   
        }
    );
    
    console.log('Player already in game. Connecting you to M')

    return (check === null ) ? null : result.value
};

export const isAlreadyInGame = async ({ sessionId, playerId }, db) => {
    let isInGame = await getSession({ sessionId, playerId }, db)

    if (isInGame === null) {
        return joinSession({ sessionId, playerId }, db)
    } else {
        return isInGame
    }
};

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

// turn on new lines at the end of the file on save
