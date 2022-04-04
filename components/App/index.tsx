import { useStore } from '../../hooks/useStore';
import { Header } from '../Header';
import { MainPage } from '../Mainpage';
import { Clipboard } from '../Clipboard';
import { Session } from '../Session';

import * as Types from '../../types';
import styles from './App.module.css';


export const App = () => {
    const [state, dispatch] = useStore()
    const { sessionId, playerId, players } = state;

    const create = () => dispatch({
        type: 'session/create',
        payload: {
            playerId,
        }
    });

    const join = (sessionId) => dispatch({
        type: 'session/join',
        payload: {
            sessionId,
            playerId,
        }
    });

    const update = (payload: Partial<Types.Player>) => {
        dispatch({
            type: 'session/update',
            payload: {
                sessionId,
                playerId,
                ...payload
            }
        });
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
            <Session players={players} playerId={playerId} onUpdate={update} />
        </div>
    )
}