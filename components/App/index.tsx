import { useCallback, useEffect } from 'react';
import { useAppStore } from '../../hooks/useAppStore';
import { useWebSocket } from '../../hooks/useWebSocket';
import { Header } from '../Header';
import { Session } from '../Session';
import { Clipboard } from '../Clipboard';
import { Button } from '../Button';
import { Input } from '../Input';
import * as Types from '../../types';
import styles from './App.module.css';

export const App = () => {
    const [{ sessionId, playerId, players, nickname }, dispatch] = useAppStore();
    const ws = useWebSocket(process.env.NEXT_PUBLIC_WS, message => dispatch(message));

    const dispatchRemoteAction = (type, payload) => ws.send({ type, payload });

    const setNickname = useCallback((nickname: Types.Nickname) => dispatch({ type: 'nickname/set', payload: { nickname } }), [dispatch]);
    const setSessionId = useCallback((sessionId: Types.SessionId) => dispatch({ type: 'sessionId/set', payload: { sessionId } }), [dispatch]);

    useEffect(() => {
        const storedNickname = localStorage.getItem('nickname');

        if (storedNickname) {
            setNickname(storedNickname);
        }
    }, [setNickname]);

    useEffect(() => localStorage.setItem('nickname', nickname), [nickname]);

    const create = () => dispatchRemoteAction('session/create', { playerId, nickname });
    const join = () => dispatchRemoteAction('session/join', { sessionId, playerId, nickname });
    const exit = () => dispatchRemoteAction('session/exit', { sessionId, playerId });
    const update = (payload: Partial<Types.Player>) => dispatchRemoteAction('session/update', { sessionId, playerId, ...payload });

    const isSessionActive = sessionId && playerId && players.length;

    if (isSessionActive) {
        return (
            <div className={styles.root}>
                <Header>
                    <Clipboard value={sessionId} />
                    <Button onClick={exit} text="Exit" />
                    <Button onClick={() => update({ temporaryBonus: 0 })} text="Next turn" />
                </Header>
                <Session players={players} playerId={playerId} onUpdate={update} />
            </div>
        );
    }

    return (
        <div className={styles.root}>
            <Input onChange={setNickname} placeholder="Your name" value={nickname} />
            <Button onClick={create} text="Create" />
            <div>
                <Input onChange={setSessionId} placeholder="Session Id" />
                <Button onClick={join} text="Join" />
            </div>
        </div>
    );
}
