import { useRouter } from 'next/router';
import { useEffect, useReducer, useRef, useState } from 'react';

import { MainPage } from '../components/mainpage';
import { Error } from '../components/error';
import { Home as ReturnHome }  from '../components/home';
import { Session } from '../components/session';
import { ERRORS } from '../constants';
import { Player as PlayerType } from '../types'

import styles from '../styles/Main.module.css'
import { useStore } from '../hooks/useStore';


export default function Home() {
    const ws = useRef<WebSocket|null>(null);
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
    });

    const update = (data: Partial<PlayerType>) => send({
        type: 'session/update',
        playerId,
        sessionId,
        ...data,
    });

    useEffect(() => {
        if (ws.current) {
            console.log('websocket is already initialized');
            return;
        }

        ws.current = new WebSocket(process.env.NEXT_PUBLIC_WS_HOST)

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
        return <Error cause={ ERRORS.WS } />
    }

    return (
        (sessionId) ? <div className={styles.gamers}>
            <ReturnHome onClick={update} />
            <Session {...state} update={update} /></div>:
        <MainPage create={create} join={join} playerId={playerId} />
    )
}
