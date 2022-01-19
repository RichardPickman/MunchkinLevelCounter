import { Player } from '../player/index'

export const Session = ({ playerId, sessionId, players, update, router }: {[k:string]: any}) => {
    return (
        <div>
            {sessionId}
            {players.map(( player, index ) => player.isInside == true && <Player onClick={ playerId === player.playerId && update } {...player} key={index} />)}
        </div>
    )
}