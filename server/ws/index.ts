import { WebSocketServer } from "ws";
import { arrayBufferToJSON } from "../../helpers";
import { handleAction } from "../actions";
import { getSessionByPlayerId } from "../resolvers";
import { getWebSocketsBySession, broadcast } from "./helpers";


const wsCache = new Map();


export const onClose = async ({ ws }) => {
    const cacheItems = Array.from(wsCache.entries());
    const cachedSocket = cacheItems.find(([, value]) => value === ws);
    const [playerId] = cachedSocket || [];

    wsCache.delete(playerId);

    if (!playerId) {
        return console.log('socket was not cached');
    }

    const { sessionId } = await getSessionByPlayerId(playerId) || {};

    if (!sessionId) {
        return;
    }

    const payload = await handleAction('session/exit', { playerId, sessionId });
    const websockets = getWebSocketsBySession(wsCache, payload);

    broadcast(websockets, { type: 'session/update', payload })

    console.log(playerId, 'removed from cache due to closed connection');
};

export const onMessage = async ({ message, ws }) => {
    const { type, payload } = message;
    const session = await handleAction(type, payload);

    if (type === 'session/join' && !session) {
        return broadcast([ws], { type: 'session/error', error: 'not found' })
    }

    const websockets = getWebSocketsBySession(wsCache, session).filter(websocket => websocket !== ws);

    if (type === 'session/create' || type === 'session/join') {
        const player = session.players[session.players.length - 1];

        wsCache.set(player.playerId, ws);
    }

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
