import { useEffect, useRef, useState } from 'react'
import { Player } from '../../components/player'
import { createSession } from '../../components/updateGame'; 
import styles from './index.module.css'

export default function createGame () {
    const ws = useRef<WebSocket|null>(null);
    const [connected, setConnected] = useState(false)
    const [me, setMe] = useState<{ playerId: string | null }>({ playerId: null });
    const [players, setPlayers] = useState<{ [k: string]: any }[]>([]);
    const [sessionId, setSessionId] = useState()

    const handleUpdate = ({key, value}) => {
        const payload = {playerId: me, [key]: value, sessionId};
        const action = {
            'action': 'update',
            payload,
        };
        console.log(action)
        ws.current.send(JSON.stringify(action));
    };

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8080');

        ws.current.onmessage = (message) => {
            const mess = JSON.parse(message.data)
    
            if (mess.playerId) {
                const req = createSession(mess)
                setMe(mess.playerId)

                ws.current.send(JSON.stringify(req))
            } else if (mess.sessionId) {
                setSessionId(mess.sessionId)
                setPlayers(mess.players)
                console.log(mess.players)
            }
        };
        

        ws.current.onopen = (event) => {
            setConnected(true)
        }
    
        return () => ws.current?.close();
    }, []);

    if (!connected) {
        return (
        <div> 
            <h1> YOU ARE DISCONNECTED</h1> 
        </div>
        )
    }

    return (
        <div className={styles.root}> 
            {
            players.map((player, index) => <Player onClick={me == player.playerId && handleUpdate} {...player} key={index} />)
            } 
        </div> 
    )
}