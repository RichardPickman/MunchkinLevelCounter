import { Player } from '../Player'
import * as Types from '../../types'

import styles from './Session.module.css';


interface Props {
    playerId: Types.PlayerId,
    players: Types.Player[],
    onUpdate: (args: Partial<Types.Player>) => void
}

export const Session = ({ playerId, players, onUpdate }: Props) => {
    const index = players.findIndex(player => player.playerId === playerId)
    const sortedPlayers = [...players.slice(index), ...players.slice(0, index)]

    return (
        <div className={styles.root}>
            {sortedPlayers.map(player => player.isActive && (
                <Player
                    {...player}
                    onClick={playerId === player.playerId && onUpdate}
                    key={player.playerId}
                />
            ))}
        </div>
    )
}
