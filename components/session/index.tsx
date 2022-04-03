import { Player } from '../Player'
import * as Types from '../../types'

import styles from './Session.module.css';

interface Props extends Types.Session {
    playerId: Types.PlayerId,
    update: (args: Partial<Types.Player>) => void
}

export const Session = ({ playerId, players, update }: Props) => {
    return (
        <div className={styles.root}>
            {players.map(player => player.isActive && (
                <Player
                    {...player}
                    onClick={playerId === player.playerId && update}
                    key={player.playerId}
                />
            ))}
        </div>
    )
}
