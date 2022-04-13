import { createSession, updateSession, joinSession, exitSession } from './session'


export const handleAction = async (action, payload, db) => {
    switch (action) {
        case 'session/create':
            return createSession(payload, db);
        case 'session/update':
            return updateSession(payload, db);
        case 'session/join':
            return joinSession(payload, db);
        case 'session/exit':
            return exitSession(payload, db);
        default:
            console.log('invalid action: ', action)
    }
};
