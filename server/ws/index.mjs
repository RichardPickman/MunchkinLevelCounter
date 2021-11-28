import { WebSocketServer } from 'ws';

export const getWebSocketServer = () => {
    const connectionServer = new WebSocketServer({ port: 8080 })
    return connectionServer
} // new WebSocketServer({ port: 8080 });