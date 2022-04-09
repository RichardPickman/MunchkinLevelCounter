import { arrayBufferToJSON } from "../../helpers";
import { handleAction } from "../actions";
import { getSessionByPlayerId } from "../resolvers";
import { getWebSocketsBySession, broadcast, cacheIt } from "./helpers";

export const onClose = <K, V>(wsCache: Map<K, V>, db, ws): void => {
    const cacheItems = Array.from(wsCache.entries());
    const cachedSocket = cacheItems.find(([, value]) => value === ws);
    const [playerId] = cachedSocket || [];

    if (!playerId) {
        console.log('socket was not cached');
        return;
    };

    wsCache.delete(playerId);

    setTimeout(async () => {
        if (!wsCache.has(playerId)) {
            const session = await getSessionByPlayerId(playerId, db);

            if (!session) return;

            const payload = await handleAction({
                type: 'session/update',
                payload: {
                    playerId,
                    sessionId: session.sessionId,
                    isActive: false,
                }
            }, db);
            
            const websockets = getWebSocketsBySession(wsCache, payload);

            if (websockets) {
                broadcast(websockets, { type: 'session/update', payload })
            }
        }
    }, 1000 * 5)

    console.log(playerId, 'removed from cache due to closed connection');
};

export const onMessage = async (buffer, wsCache, ws, db) => {
    const action = arrayBufferToJSON(buffer);
    const session = await handleAction(action, db);
    const websockets = getWebSocketsBySession(wsCache, session).filter(websocket => websocket !== ws);

    cacheIt(action, session, wsCache, ws)

    broadcast([ws], { type: action.type, payload: session });
    broadcast(websockets, { type: 'session/update', payload: session });

};
