import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react'
import { Player } from '../../components/helpers'
import { joinSession } from '../../components/updateGame';

export default function Game () {
    const ws = useRef<WebSocket|null>(null);
    const [connected, setConnected] = useState(false)
    const [me, setMe] = useState<{ playerId: string | null }>({ playerId: null });
    const [players, setPlayers] = useState<{ [k: string]: any }[]>([]);
    const [sessionId, setSessionId] = useState()
    const { query } = useRouter()

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
                setMe(mess.playerId)

                const payload = {playerId: mess.playerId, sessionId: query.gameId}
                const req = joinSession(payload)

                ws.current.send(JSON.stringify(req))

            } else if (mess.sessionId) {
                setSessionId(mess.sessionId)
                setPlayers(mess.players)
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
            players.map((player, index) => <Player onClick={me == player.playerId && handleUpdate} {...player} key={index} />)
            } 
        </div> 
    )
}
