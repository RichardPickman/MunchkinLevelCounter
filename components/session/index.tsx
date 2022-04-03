import { Player } from '../Player'
import * as Types from '../../types'

import styles from './Session.module.css';
interface Props extends Types.Session {
    playerId: Types.PlayerId,
    update: (args: Partial<Types.Player>) => void
}

export const Session = ({ playerId, players, update }: Props) => {
    const index = players.findIndex(player => player.playerId === playerId)
    const sortedPlayers = [...players.slice(index), ...players.slice(0, index)]

    return (
        <div className={styles.root}>
            {sortedPlayers.map(player => player.isActive && (
                <Player
                    {...player}
                    onClick={playerId === player.playerId && update}
                    key={player.playerId}
                />
            ))}
        </div>
    )
}
