import { useState } from 'react';

import { Clipboard } from './helpers'
import { Player } from '../player/index'

import styles from './Session.module.css';

export const Session = ({ playerId, sessionId, players, update }: {[k:string]: any}) => {
    return (
        <div className={styles.session}>
            <div className={styles.idBlock}>
                <Clipboard sessionId={sessionId} />
            </div>
            <div className={styles.gamers}>
                {players.map(( player, index ) => player.isActive && <Player onClick={ playerId === player.playerId && update } {...player} key={index} />)}
            </div>
        </div>
    )
}
