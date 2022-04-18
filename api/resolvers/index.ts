import { getUpdateFields } from '../helpers';
import { getDb } from '../db';


export const getSession = ({ sessionId, playerId }) => {
    return getDb()
        .then(db => db.collection('sessions').findOne({
            sessionId,
            players: { $elemMatch: { playerId } }
        }));
}

export const getSessionBySessionId = (sessionId) => {
    return getDb()
        .then(db => db.collection('sessions').findOne({ sessionId }))
        .then(result => result.players);
}

export const insertSession = (session) => {
    return getDb()
        .then(db => db.collection('sessions').insertOne(session));
}

export const insertPlayer = ({ sessionId }, player) => {
    return getDb()
        .then(db => db.collection('sessions').findOneAndUpdate(
            { sessionId },
            { $push: { players: player } },
            { returnDocument: 'after' }
        ))
        .then(result => result.value);
}

export const updateSessionState = ({ sessionId, playerId, ...changes }) => {
    return getDb()
        .then(db => db.collection('sessions').findOneAndUpdate(
            { sessionId },
            { $set: getUpdateFields(changes) },
            { arrayFilters: [{ "elem.playerId": playerId }], returnDocument: 'after' }
        ))
        .then(result => result.value);
}

export const getSessionByPlayerId = async (playerId) => {
    return getDb().then(db => db.collection('sessions').findOne({
        players: {
            $elemMatch: { playerId, isActive: true }
        }
    }));
}
