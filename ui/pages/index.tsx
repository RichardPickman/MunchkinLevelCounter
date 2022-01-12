import  styles  from '../styles/Home.module.css'
import { Player } from '../components/helpers/helpers'
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

// move it to hooks/useLocalStorage/index.tsx
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

    const [connected, setConnected] = useState(false);
    const inputRef = useRef<HTMLInputElement>();
    const router = useRouter();

    const savedPlayerId = useLocalStorage("playerId");
    const [playerId, setPlayerId] = useState(savedPlayerId);
    const [players, setPlayers] = useState<{ [k: string]: any }[]>([]);
    const [sessionId, setSessionId] = useState();

    console.log('saved id =', savedPlayerId);
    console.log('active id =', playerId);
    
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

    useEffect(() => !playerId && send({ action: 'player/getId' }), []);

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

    useEffect(() => sessionId && router.push(`/${sessionId}`, undefined, { shallow: true }), [sessionId]);

    if (!connected) {
        // <Error message="You are disconnected" />
        return (
            <div>
                <div>YOU ARE DISCONNECTED</div> 
            </div>
        )
    }

    if (sessionId) {
        // <Session players={players} />
        return (
            <div>
                {sessionId} 
                {players && players.map(( player, index ) => <Player onClick={ playerId === player.playerId && update } {...player} key={index} />)} 
            </div>
        )
    }

    return (
        // <HomePage onCreate={create} onJoin={join} />
        <div className={styles.homePage}>
            <div className={styles.btngroup}>
                <button onClick={create} disabled={!playerId}>Create game</button> 
                <div className={styles.joining}>
                    <input ref={inputRef} placeholder='Enter id'></input>
                    <button onClick={join} disabled={!playerId}>Join game</button> 
                </div>
            </div>

        </div>
    )
}