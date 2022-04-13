import { useAppStore } from '../../hooks/useAppStore';
import { useWebSocket } from '../../hooks/useWebSocket';
import { Header } from '../Header';
import { MainPage } from '../Mainpage';
import { Clipboard } from '../Clipboard';
import { Session } from '../Session';

import * as Types from '../../types';
import styles from './App.module.css';


export const App = () => {
    const [{ sessionId, playerId, players }, dispatch] = useAppStore()
    const ws = useWebSocket(message => dispatch(message))

    const dispatchRemoteAction = (type, payload) => ws.send({ type, payload })

    const create = (nickname: Types.Nickname) => dispatchRemoteAction('session/create', { playerId, nickname });
    const join = (sessionId: Types.SessionId, nickname: Types.Nickname) => dispatchRemoteAction('session/join', { sessionId, playerId, nickname });
    const update = (payload: Partial<Types.Player>) => dispatchRemoteAction('session/update', { sessionId, playerId, ...payload });
    const exit = () => dispatchRemoteAction('session/exit', { sessionId, playerId });

    if (!sessionId) {
        return <MainPage create={create} join={join} />
    }

    return (
        <div className={styles.root}>
            <Header>
                <Clipboard value={sessionId} />
                <button onClick={exit}>Exit</button>
                <button onClick={() => update({ temporaryBonus: 0 })}>Next turn</button>
            </Header>
            <Session players={players} playerId={playerId} onUpdate={update} />
        </div>
    )
}