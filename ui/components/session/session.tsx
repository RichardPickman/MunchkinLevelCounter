import { useEffect, useRef, useState } from 'react';
import { Player } from '../player/player'
import styles from './Session.module.css';

export const Session = ({ playerId, sessionId, players, update, }: {[k:string]: any}) => {
    const [isCopied, setIsCopied] = useState(false);
    const classList = [styles.copy, isCopied ? styles.success : styles.copying ].join(' ');

    const onCopy = () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 5000);
        navigator.clipboard.writeText(sessionId)
    }

    return (
        <div className={styles.session}>
            <div className={styles.idBlock}>
                <div className={styles.id}>
                    <p>{sessionId}</p>
                    <button className={classList} onClick={onCopy}></button>
                </div>
            </div>
            <div className={styles.gamers}>
                {players.map(( player, index ) => player.isActive && <Player onClick={ playerId === player.playerId && update } {...player} key={index} />)}
            </div>
        </div>
    )
}
