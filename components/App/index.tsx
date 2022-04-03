import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { ERRORS } from '../../constants';
import { useStore } from '../../hooks/useStore';
import { Header } from '../Header';
import { MainPage } from '../Mainpage';
import { Error } from '../Error';
import { Clipboard } from '../Clipboard';
import { Session } from '../Session';

import * as Types from '../../types';
import styles from './App.module.css';


export const App = (props) => {
    const ws = useRef<WebSocket | null>(null);
    const router = useRouter();
    const [connected, setConnected] = useState(false);
    const [state, dispatch] = useStore()

    const { sessionId, playerId } = state;

    const send = ({ type, ...payload }) => {
        const message = JSON.stringify({ type, payload });

        if (ws.current) ws.current.send(message);
    };

    const create = () => send({
        type: 'session/create',
        playerId,
    });

    const join = (sessionId) => send({
        type: 'session/join',
        sessionId,
        playerId,
    });

    const update = (data: Partial<Types.Player>) => {
        dispatch({
            type: 'session/update',
            payload: {
                ...state,
                players: state.players.map(player => {
                    if (player.playerId === playerId) {
                        return {
                            ...player,
                            ...data,
                        }
                    }

                    return player;
                }),
            }
        });
        
        send({
            type: 'session/update',
            playerId,
            sessionId,
            ...data,
        })
    }

    useEffect(() => {
        if (ws.current) {
            console.log('websocket is already initialized');
            return;
        }

        ws.current = new WebSocket(`wss://${props.host}`)

        ws.current.onmessage = (message) => {
            const action = JSON.parse(message.data);

            dispatch(action)

            console.log('action received:', action);
        }
        
        ws.current.onopen = () => setConnected(true);
        
        ws.current.onclose = () => update({ isActive: false });
        
        return () => ws?.current.close();
        
    }, []);
    
    useEffect(() => {
        const url = sessionId ? `/#${sessionId}` : '/'

        router.push(url, undefined, { shallow: true });
    }, [sessionId])

    if (!connected) {
        return <Error cause={ERRORS.WS} />
    }

    if (!sessionId) {
        return <MainPage create={create} join={join} />
    }

    return (
        <div className={styles.root}>
            <Header>
                <Clipboard value={sessionId} />
                <button onClick={() => update({ isActive: false })}>Home</button>
                <button onClick={() => update({ temporaryBonus: 0 })}>Next turn</button>
            </Header>
            <Session {...state} playerId={playerId} update={update} />
        </div>
    )
}
