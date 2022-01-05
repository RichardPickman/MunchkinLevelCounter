import { useEffect, useRef, useState } from 'react'
import { Player } from '../../components/player'
import { updateSession, createSession } from '../../components/updateGame';
import { Fragment } from 'react'
import classes from '../../frag/Player.module.css'

export default function createGame () {
    const ws = useRef<WebSocket|null>(null);
    const [connected, setConnected] = useState(false)
    const [me, setMe] = useState<{ playerId: string | null }>({ playerId: null });
    const [players, setPlayers] = useState<{ [k: string]: any }[]>([]);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8080');

        ws.current.onmessage = (message) => {
            const mess = JSON.parse(message.data)
    
            if (mess.playerId) {
                const req = createSession(mess)
                setMe(mess.playerId)

                ws.current.send(JSON.stringify(req))
            } else if (mess.sessionId) {
                setPlayers(mess.players)
            }

            const handleUpdate = ({key, value}) => {
                const payload = {[key]: value, playerId: me};
                const action = {
                    'action': 'update',
                    payload,
                };
                
                ws.current.send(JSON.stringify(action));
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
        <div> 
            {
            players.map(player => <Player onClick={handleUpdate()} playerId={player.playerId} props={player} />)
            } 
        </div> 
    )
}
