import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

// import { useLocalStorage } from '../hooks/useLocalStorage/index.mjs';
import { MainPage } from '../components/mainpage/index.mjs';
import { Error } from '../components/error/index.mjs';
import { Session } from '../components/session/index.mjs';

const useLocalStorage = (key) => {
    const [value] = useState(() => {
        // почитай про globalThis, это новая фича языка
        return globalThis.localStorage && globalThis.localStorage.getItem(key)
    });

    return value;
}

export default function Home() {
    const ws = useRef<WebSocket|null>(null);

    const send = data => {
        const message = JSON.stringify(data);

        if (ws.current) {
            console.log('sending message:', message);
            ws.current.send(message);
        }
    };

    const inputRef = useRef<HTMLInputElement>();
    const router = useRouter();
    
    const savedPlayerId = useLocalStorage("playerId");
    const [connected, setConnected] = useState(false);
    const [playerId, setPlayerId] = useState(savedPlayerId);
    const [players, setPlayers] = useState<{ [k: string]: any }[]>([]);
    const [sessionId, setSessionId] = useState();

    console.log('saved id = ', savedPlayerId);
    console.log('active id = ', playerId);
    
    useEffect(() => {
        if (ws.current) {
            console.log('websocket is already initialized');
            return;
        }

        ws.current = new WebSocket(process.env.NEXT_PUBLIC_WS_HOST)
        
        ws.current.onmessage = (message) => {
            const data = JSON.parse(message.data)

            console.log('message received:', data);

            switch (data.action) {
                case 'player/getId':
                    localStorage.setItem("playerId", data.payload.playerId)
                    setPlayerId(data.payload.playerId)
                    break;
                case 'session/update':
                case 'session/join':
                case 'session/create': {
                    setPlayers(data.payload.players)
                    setSessionId(data.payload.sessionId)
                    break }
                default: 
                    console.log('Action not supported')
                    break
            }
        }
        
        ws.current.onopen = () => setConnected(true);
    
        return () => ws?.current.close();
    }, []);

    useEffect(() =>  connected && !playerId && send({ action: 'player/getId' }), [connected]);

    const create = () => send({ 
        action: 'session/create',
        payload: { playerId },
    });

    const join = () => send({ 
        action: 'session/join', 
        payload: { playerId, sessionId: inputRef.current.value },
    });

    const update = ({key, value}) => send({
        action: 'session/update',
        payload: {
            playerId, 
            sessionId,
            [key]: value, 
        },
    });

    useEffect(() => sessionId && router.push(`/#${sessionId}`, undefined, { shallow: true }), [sessionId]);

    if (!connected) {
        return (
            <Error />
        )
    }

    if (sessionId) {
        return (
            <Session sessionId={sessionId} players={players} update={update} />
        )
    }

    return (
            <MainPage create={create} join={join} playerId={playerId} inputRef={inputRef}/> 
    )
}