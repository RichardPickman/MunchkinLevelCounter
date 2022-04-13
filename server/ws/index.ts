import { WebSocketServer } from "ws";
import { arrayBufferToJSON } from "../../helpers";
import { handleAction } from "../actions";
import { getSessionByPlayerId } from "../resolvers";
import { getWebSocketsBySession, broadcast, cacheIt } from "./helpers";

const wsCache = new Map();

export const onClose = async ({ db, ws }) => {
    const cacheItems = Array.from(wsCache.entries());
    const cachedSocket = cacheItems.find(([, value]) => value === ws);
    const [playerId] = cachedSocket || [];
    wsCache.delete(playerId);

    if (!playerId) return console.log('socket was not cached');

    const { sessionId } = await getSessionByPlayerId(playerId, db) || {};

    if (!sessionId) return

    const payload = await handleAction('session/exit', { playerId, sessionId }, db);
    const websockets = getWebSocketsBySession(wsCache, payload);

    broadcast(websockets, { type: 'session/update', payload })

    console.log(playerId, 'removed from cache due to closed connection');
};

export const onMessage = async ({ message, ws, db }) => {
    const { type, payload } = message;
    const session = await handleAction(type, payload, db);
    const websockets = getWebSocketsBySession(wsCache, session).filter(websocket => websocket !== ws);

    cacheIt(type, session, wsCache, ws)

    broadcast([ws], { type: type, payload: session });
    broadcast(websockets, { type: 'session/update', payload: session });

};

export const createWebSocketServer = (onMessage, onClose, options = { noServer: true }) => {
    const wss = new WebSocketServer(options);

    wss.on('connection', ws => {
        ws.on('close', () => onClose({ ws }));
        ws.on('message', arrayBuffer => onMessage({ message: arrayBufferToJSON(arrayBuffer), ws }));
    });

    return wss;
};