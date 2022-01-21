import { Player } from '../player/index'

export const Session = ({ playerId, sessionId, players, update, exit }: {[k:string]: any}) => {
    return (
        <div>
            {sessionId}
            {players.map(( player, index ) => player.isActive == 'Online' && <Player onEnter={ playerId === player.playerId && update } onExit={exit} {...player} key={index} />)}
        </div>
    )
}
