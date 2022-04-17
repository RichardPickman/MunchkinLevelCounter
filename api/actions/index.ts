import { createSession, updateSession, joinSession, exitSession } from './session'


export const handleAction = async (action, payload) => {
    switch (action) {
        case 'session/create':
            return createSession(payload);
        case 'session/update':
            return updateSession(payload);
        case 'session/join':
            return joinSession(payload);
        case 'session/exit':
            return exitSession(payload);
        default:
            console.log('invalid action: ', action)
    }
};
