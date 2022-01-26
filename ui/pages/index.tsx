import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import { useLocalStorage } from '../hooks/useLocalStorage/index';
import { MainPage } from '../components/mainpage/index';
import { Error } from '../components/error/index';
import { Session } from '../components/session/index';


export default function Home() {
    
    const send = data => {
        const message = JSON.stringify(data);
        
        if (ws.current) ws.current.send(message);
    };
    
    const create = () => send({ 
        action: 'session/create', 
        payload: { playerId }, 
    });
    
    const join = (sessionId) => send({ 
        action: 'session/join', 
        payload: { playerId, sessionId },
    });
    
    const update = ({key, value}) => send({
        action: 'session/update',
        payload: {
            playerId, 
            sessionId,
            [key]: value, 
        },
    });
    
    const exit = ({key, value}) => send({
        action: 'session/exit',
        payload: {
            playerId, 
            sessionId,
            [key]: value, 
        },
    })
    
    const ws = useRef<WebSocket|null>(null);
    const router = useRouter();
    
    const savedPlayerId = useLocalStorage("playerId");
    const [connected, setConnected] = useState(false);
    const [playerId, setPlayerId] = useState(savedPlayerId);
    const [players, setPlayers] = useState<{ [k: string]: any }[]>([]);
    const [sessionId, setSessionId] = useState();

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
                    break
                }
                case 'session/exit': {
                    setPlayers([]);
                    setSessionId(null);
                    break;
                }
                default: 
                    console.log('Action not supported')
                    break
            }
        }
        
        ws.current.onopen = () => setConnected(true);

        ws.current.onclose = () => exit({ key: 'isActive', value: false })

        return () => ws?.current.close();
        
    }, []);

    useEffect(() =>  connected && !playerId && send({ action: 'player/getId' }), [connected]);

    useEffect(() => sessionId && router.push(`/#${sessionId}`, undefined, { shallow: true }), [sessionId]);

    if (!connected) {
        return <Error cause="ws" />
    }

    return (
        (sessionId) ? <Session 
        playerId={playerId} 
        sessionId={sessionId} 
        players={players} 
        update={update} 
        exit={exit}/>: 
        <MainPage create={create} join={join} playerId={playerId} />  
    )
}
