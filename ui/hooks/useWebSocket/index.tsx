import { useEffect, useRef, useState } from 'react'


export const useWebSocket = (url,onMessage) => {
    const ws = useRef<WebSocket | null>(null);
    const [isConnected, setConnected] = useState(false);

    const send = (data) => {
        return ws.current.send(JSON.stringify(data));
    };

    useEffect(() => {
        if (ws.current) {
            console.log('websocket is already initialized');
            return;
        }

        ws.current = new WebSocket(url)

        ws.current.onmessage = (message) => onMessage(JSON.parse(message.data));
        
        ws.current.onopen = () => setConnected(true);
        
        ws.current.onclose = () => setConnected(false);
        
        return () => ws?.current.close();
    }, []);

    return {
        send,
        isConnected,
    }

}
