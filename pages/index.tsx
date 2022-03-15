import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import { useLocalStorage } from '../hooks/useLocalStorage/';
import { MainPage } from '../components/mainpage/';
import { Error } from '../components/error/';
import { Home as ReturnHome }  from '../components/home/';
import { Session } from '../components/session/';
import { ERRORS } from '../server/constants/index.mjs';
import { Player as PlayerType } from '../types/'

import styles from '../styles/Main.module.css'

export default function Home() {
    const ws = useRef<WebSocket|null>(null);
    const router = useRouter();
    const savedPlayerId = useLocalStorage("playerId");
    const [connected, setConnected] = useState(false);
    const [playerId, setPlayerId] = useState(savedPlayerId);
    const [players, setPlayers] = useState<{ [k: string]: any }[]>([]);
    const [sessionId, setSessionId] = useState();

    const send = data => {
        const message = JSON.stringify(data);

        if (ws.current) ws.current.send(message);
    };

    const create = () => send({
        action: 'session/create',
        payload: { playerId },
    });

    const join = (sessionId) => send({
        action: 'session/join',
        payload: { playerId, sessionId },
    });

    const update = (data: Partial<PlayerType>) => send({
        action: 'session/update',
        payload: {
            playerId,
            sessionId,
            ...data,
        },
    });

    useEffect(() => {
        if (ws.current) {
            console.log('websocket is already initialized');
            return;
        }

        ws.current = new WebSocket(process.env.NEXT_PUBLIC_WS_HOST)

        ws.current.onmessage = (message) => {
            const data = JSON.parse(message.data)

            console.log('message received:', data);

            switch (data.action) {
                case 'player/getId':
                    localStorage.setItem("playerId", data.payload.playerId)
                    setPlayerId(data.payload.playerId)
                    break;
                case 'session/update':
                case 'session/join':
                case 'session/create': {
                    const { isActive } = data.payload.players.find(elem => elem.playerId === playerId) ?? {}

                    setPlayers(isActive ? data.payload.players : []);
                    setSessionId(isActive ? data.payload.sessionId : null);

                    break;
                }
                default:
                    console.log('Action not supported')
                    break
            }
        }

        ws.current.onopen = () => setConnected(true);

        ws.current.onclose = () => {
            update({ isActive: false })
        };

        return () => ws?.current.close();

    }, []);

    useEffect(() => connected && !playerId && send({ action: 'player/getId' }), [connected]);

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
            <Session
                playerId={playerId}
                sessionId={sessionId}
                players={players}
                update={update} /></div>:
        <MainPage create={create} join={join} playerId={playerId} />
    )
}
