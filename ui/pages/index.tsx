import  styles  from '../styles/Home.module.css'
import { Player } from '../components/helpers'
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

const useLocalStorage = (key) => {
    let value;

    useEffect(() => {
        value = localStorage.getItem(key)
    }, [key]);

    return value;
}


export default function Home() {
    const ws = useRef<WebSocket|null>(null);
    const send = data => {ws.current && ws.current.send(JSON.stringify(data))}

    const [connected, setConnected] = useState(false);
    const inputRef = useRef<HTMLInputElement>()
    const router = useRouter()
    const localId = useLocalStorage("playerId")
    const [playerId, setPlayerId] = useState(localId);
    const [players, setPlayers] = useState<{ [k: string]: any }[]>([]);
    const [sessionId, setSessionId] = useState()
    
    useEffect(() => {
        if (ws.current) {
            return
        }
        ws.current = new WebSocket(process.env.NEXT_PUBLIC_WS_HOST)
        
        ws.current.onmessage = (message) => {
            const data = JSON.parse(message.data)
            console.log(data)
            
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

    if (!playerId) {
        send({
            action: 'player/getId',
        })
    }
    
    const create = () => send({
        action: 'session/create',
        payload: { playerId,  },
    });

    const join = () => send({
        action: 'session/join',
        payload: {
            playerId,
            sessionId: inputRef.current.value 
        }
    });

    const handleUpdate = ({key, value}) => send({
        action: 'session/update',
        payload: {
            playerId, 
            [key]: value, 
            sessionId,
        },
    });

    useEffect(() => {
        if (sessionId) { 
            router.push(`/${sessionId}`, undefined, { shallow: true })
        }
    }, [sessionId])

    if (sessionId) {
        return (
            <div>
                {sessionId} 
            {
            players && players.map(( player, index ) => <Player onClick={ playerId == player.playerId && handleUpdate } {...player} key={index} />)
            } 
        </div> 
        )
    }

    if (!connected) {
        return (
            <div> 
                <h1> YOU ARE DISCONNECTED</h1> 
            </div>
        )
    }
    
    return (
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