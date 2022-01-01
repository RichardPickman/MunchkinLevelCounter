import { useEffect, useRef, useState } from 'react'
import { OtherPlayerDataBlock } from '../../frag/player'
import { updateSession, createSession } from '../../frag/updateGame';
import { Fragment } from 'react'

import classes from '../../frag/Player.module.css'

export default function createGame () {
    const ws = useRef<WebSocket|null>(null);
    const [connected, setConnected] = useState(false)
    const [me, setMe] = useState<{ playerId: string | null }>({ playerId: null });
    const [players, setPlayers] = useState<{ [k: string]: any }[]>([]);

    function blockHandler(data) {
        if (data.playerId == me ) {
            return <PlayerDataBlock props={data} />
        } else {
            return <OtherPlayerDataBlock props={data} />
        }
    }

    function handleUpdate(data) {
        const req = updateSession(data)
    
        ws.current.send(JSON.stringify(req))
    }

    function PlayerDataBlock(props) {
        return (
            <Fragment>
                {
                    <div className={ classes.playerBlock }>
                        <div>
                            <p> Your playerId is {props.playerId}</p>
                        </div>
                        <div>
                        <button onClick={() => { handleUpdate({ playerId: props.playerId, sessionId: props.sessionId, level: props.level - 1 })}}> - 1</button>
                            <p> Your level is {props.level}</p>
                            <button onClick={() => { handleUpdate({ playerId: props.playerId, sessionId: props.sessionId, level: props.level + 1 })}}> + 1</button>
                        </div>
                        <div>
                        <button onClick={() => { handleUpdate({ playerId: props.playerId, sessionId: props.sessionId, equipment: props.equipment - 1 })}}> - 1</button>
                            <p> Your equipment is {props.equipment}</p>
                            <button onClick={() => { handleUpdate({ playerId: props.playerId, sessionId: props.sessionId, equipment: props.equipment + 1 })}}> + 1</button>
                        </div>
                        <div>
                        <button onClick={() => { handleUpdate({ playerId: props.playerId, sessionId: props.sessionId, temporaryBonus: props.temporaryBonus - 1 })}}> - 1</button>
                            <p> Your temporary bonus is {props.temporaryBonus}</p>
                            <button onClick={() => { handleUpdate({ playerId: props.playerId, sessionId: props.sessionId, level: props.temporaryBonus + 1 })}}> + 1</button>
                        </div>
                    </div>
                }
            </Fragment>
        )
    }

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8080');

        ws.current.onmessage = (message) => {
            const mess = JSON.parse(message.data)
    
            if (mess.playerId) {
                const req = createSession(mess)
                setMe(mess.playerId)

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
        <div>
            { players.map((data) => (
                blockHandler(data)
            ))}
        </div>
    )

}
