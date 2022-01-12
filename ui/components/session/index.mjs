import { Player } from '../player/index'

export const Session = ({sessionId, players, update}) => {
    return (
        <div>
            {sessionId}
            {players.map(( player, index ) => <Player onClick={ playerId === player.playerId && update } {...player} key={index} />)}
        </div>
    )
}