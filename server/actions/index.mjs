import { createSession, updateSession, joinSession } from './session.mjs'


export const handleAction = async (data, client) => {
    switch (data.action) {
        case 'create': 
            return createSession(data.payload, client);
        case 'update':
            return updateSession(data.payload, client);
        case 'join':
            return joinSession(data.payload, client);
    }
};