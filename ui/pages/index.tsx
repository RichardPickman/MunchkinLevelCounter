import  styles  from '../styles/Home.module.css'
import { Player } from '../components/helpers'
import { useRouter } from 'next/router';
import { joinSession } from '../components/updateGame';
import { useEffect, useRef } from 'react';

export default function Home({me, ws, sessionId, players}) {
    const inputRef = useRef<HTMLInputElement>()
    const router = useRouter()

    const create = () => {
        const payload = {playerId: me};
        const action = {
            'action': 'create',
            payload,
        };

        ws.current.send(JSON.stringify(action));
    }

    const join = () => {
        const payload = {playerId: me, sessionId: inputRef.current.value}
        const req = joinSession(payload)
        

        ws.current.send(JSON.stringify(req));
    }

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
        if (sessionId) { 
            router.push(`/${sessionId}`, undefined, { shallow: true })
        }
    }, [sessionId])

    if (sessionId) {
        return (
            <div>
                {sessionId} 
            {
            players && players.map((player, index) => <Player onClick={me == player.playerId && handleUpdate} {...player} key={index} />)
            } 
        </div> 
        )
    }

    
    return (
        <main>
            <div className={styles.btngroup}>
                <button onClick={create}>Create game</button> 
                <button onClick={join}>Join game</button> 
                <input ref={inputRef}></input>
            </div>

        </main>
    )
}