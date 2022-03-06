import { getUpdateFields } from '../helpers.mjs';

export const getSession = async ({ sessionId, playerId }, db) => {
    const result = await db.collection('sessions').findOne({ 
        sessionId, 
        players: { $elemMatch: { playerId } } 
    });

    return result
};

export const insertSession = async ( session, db ) => {
    const result = await db.collection('sessions').insertOne(session);

    return result
}

export const insertPlayer = async ({ sessionId }, player, db) => {
    const result = await db.collection('sessions').findOneAndUpdate(
    { sessionId }, 
    { $push: { players: player }},
    { returnDocument: 'after'});

    return result.value
}

export const updateSessionState = async ({sessionId, playerId, ...changes}, db) => {
    const result = await db.collection('sessions').findOneAndUpdate(
        { sessionId },
        { $set: getUpdateFields(changes) },
        { 
            arrayFilters: [{ "elem.playerId": playerId }],
            returnDocument: 'after',   
    })

    return result.value
}

export const getSessionByPlayerId = async ({ playerId }, db) => {
    const result = await db.collection('sessions').findOne({
        players: { $elemMatch: { playerId, isActive: true } }
    });

    return result.sessionId
};