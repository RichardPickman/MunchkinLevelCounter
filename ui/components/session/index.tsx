import { Player } from '../player/index'

export const Session = ({ playerId, sessionId, players, update }: {[k:string]: any}) => {
    return (
        <div>
            {sessionId}
            {players.map(( player, index ) => <Player onClick={ playerId === player.playerId && update } {...player} key={index} />)}
        </div>
    )
}