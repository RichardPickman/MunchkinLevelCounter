import { createSession, updateSession, joinSession, exitSession } from './session'
import * as Types from '../../ui/types';

type Payload = Types.Session | Types.PlayerId & { [K: string]: Types.Nickname | Types.PlayerId } 

export const handleAction = async (action: string, payload: Payload) => {
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
