import { useEffect, useRef, useState } from 'react'
import PlayerDataBlock from '../../frag/player'
import { updateSession, joinSession, createSession } from '../../frag/updateGame';


const Player = (props: any) => (
    <div>
        {props.level}
        {props.isMe && 'it\'s me'}
        {props}
    </div>
);



export default function createGame () {
    const ws = useRef<WebSocket|null>(null);
    const [connected, setConnected] = useState(false)
    const [me, setMe] = useState<{ playerId: number | null }>({ playerId: null });
    const [players, setPlayers] = useState<{ [k: string]: any }[]>([]);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8080');

        ws.current.onmessage = (message) => {
            const mess = JSON.parse(message.data)

            function handleUpdate() {
                const req = updateSession(mess)

                ws.current.send(JSON.stringify(req))
            }
    
            if (mess.playerId) {
                const req = createSession(mess)
    
                ws.current.send(JSON.stringify(req))
            } 
            else if (mess.sessionId) {
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
            <div> <h1> YOU ARE DISCONNECTED</h1> </div>
        )
    }

    return (
        <PlayerDataBlock players={players} gamer={me} />
    );

}
