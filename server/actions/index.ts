import { createSession, updateSession, joinSession } from './session'


export const handleAction = async (action, db) => {
    switch (action.type) {
        case 'session/create':
            return createSession(action.payload, db);
        case 'session/update':
            return updateSession(action.payload, db);
        case 'session/join':
            return joinSession(action.payload, db);
        default:
            console.log('ivnvalid action: ', action)
    }
};