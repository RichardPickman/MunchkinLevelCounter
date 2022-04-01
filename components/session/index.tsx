import { Clipboard } from '../clipboard'
import { Player } from '../player'
import * as Types from '../../types'

import styles from './Session.module.css';

interface Props extends Types.Session {
    playerId: Types.PlayerId,
    update: (args: Partial<Types.Player>) => void
}

export const Session = ({ playerId, sessionId, players, update }: { [k: string]: any }) => {
    return (
        <div className={styles.root}>
            <div className={styles.sessionId}>
                <Clipboard value={sessionId} />
            </div>
            <div className={styles.players}>
                {players.map(player => player.isActive && (
                    <Player
                        {...player}
                        onClick={playerId === player.playerId && update}
                        key={player.playerId}
                    />
                ))}
            </div>
        </div>
    )
}