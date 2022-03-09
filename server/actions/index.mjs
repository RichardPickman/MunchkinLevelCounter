import { createSession, updateSession, joinSession } from './session.mjs'
import { getIdentifier } from './player.mjs';


export const handleAction = async (data, db) => {
    switch (data.action) {
        case 'session/create': 
            return createSession(data.payload, db);
        case 'session/update':
            return updateSession(data.payload, db);
        case 'session/join':
            return joinSession(data.payload, db);
        case 'player/getId':
            return getIdentifier();
        }
};
