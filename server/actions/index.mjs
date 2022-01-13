import { createSession, updateSession, joinSession, getIdentifier } from './session.mjs'


export const handleAction = async (data, db, ws) => {
    switch (data.action) {
        case 'session/create': 
            return createSession(data.payload, db, ws);
        case 'session/update':
            return updateSession(data.payload, db, ws);
        case 'session/join':
            return joinSession(data.payload, db, ws);
        case 'player/getId':
            return getIdentifier()
        }
};