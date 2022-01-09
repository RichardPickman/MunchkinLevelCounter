import  styles  from '../styles/Home.module.css'
import { Player } from '../components/helpers'
import { useRouter } from 'next/router';
import { joinSession } from '../components/updateGame';
import { useEffect, useRef } from 'react';

export default function Home({ playerId, ws, sessionId, players }) {
    const inputRef = useRef<HTMLInputElement>()
    const router = useRouter()

    const create = () => {
        const payload = { playerId };
        const action = JSON.stringify({
            'action': 'create',
            payload,
        });

        ws.current.send(action);
    }

    const join = () => {
        const payload = {playerId, sessionId: inputRef.current.value}
        const req = JSON.stringify(joinSession(payload))
        

        ws.current.send(req);
    }

    const handleUpdate = ({key, value}) => {
        const payload = {playerId, [key]: value, sessionId};
        const action = JSON.stringify({
            'action': 'update',
            payload,
        });
        
        ws.current.send(action);
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
            players && players.map(( player, index ) => <Player onClick={ playerId == player.playerId && handleUpdate } {...player} key={index} />)
            } 
        </div> 
        )
    }

    return (
        <div className={styles.homePage}>
            <div className={styles.btngroup}>
                <button onClick={create}>Create game</button> 
                <div className={styles.joining}>
                    <input ref={inputRef} placeholder='Enter id'></input>
                    <button onClick={join}>Join game</button> 
                </div>
            </div>

        </div>
    )
}