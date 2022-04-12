import { arrayBufferToJSON } from "../../helpers";
import { handleAction } from "../actions";
import { getSessionByPlayerId } from "../resolvers";
import { getWebSocketsBySession, broadcast, cacheIt } from "./helpers";

const wsCache = new Map();

export const onClose = async (db, ws) => {
    const cacheItems = Array.from(wsCache.entries());
    const cachedSocket = cacheItems.find(([, value]) => value === ws);
    const [playerId] = cachedSocket || [];
    wsCache.delete(playerId);

    if (!playerId) return console.log('socket was not cached');

    const session = await getSessionByPlayerId(playerId, db);
    const payload = await handleAction({
        type: 'session/exit',
        payload: { 
            playerId, 
            sessionId: session.sessionId 
        }
    }, db);
    const websockets = getWebSocketsBySession(wsCache, payload);

    broadcast(websockets, { type: 'session/update', payload })

    console.log(playerId, 'removed from cache due to closed connection');
};

export const onMessage = async (buffer, ws, db) => {
    const action = arrayBufferToJSON(buffer);
    const session = await handleAction(action, db);
    const websockets = getWebSocketsBySession(wsCache, session).filter(websocket => websocket !== ws);

    cacheIt(action, session, wsCache, ws)

    broadcast([ws], { type: action.type, payload: session });
    broadcast(websockets, { type: 'session/update', payload: session });

};
