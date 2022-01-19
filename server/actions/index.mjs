import { createSession, updateSession, getIdentifier, isAlreadyInGame } from './session.mjs'


export const handleAction = async (data, db) => {
    switch (data.action) {
        case 'session/create': 
            return createSession(data.payload, db);
        case 'session/update':
            return updateSession(data.payload, db);
        case 'session/join':
            return isAlreadyInGame(data.payload, db);
        case 'player/getId':
            return getIdentifier()
        }
};
