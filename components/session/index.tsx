import { Player } from '../player'
import * as Types from '../../types'

import styles from './Session.module.css';

interface Props extends Types.Session {
    playerId: Types.PlayerId,
    update: (args: Partial<Types.Player>) => void
}

export const Session = ({ playerId, players, update }: Props) => {
    return (
        <main className={styles.root}>
            {players.map(player => player.isActive && (
                <Player
                    {...player}
                    onClick={playerId === player.playerId && update}
                    key={player.playerId}
                />
            ))}
        </main>
    )
}
