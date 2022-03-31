import { useState } from 'react'
import styles from './Session.module.css'

export function Clipboard({sessionId}) {
    const [isCopied, setIsCopied] = useState(false);
    const className = [styles.copy, isCopied ? styles.success : styles.copying ].join(' ');

    const onCopy = () => {
        setIsCopied(true);
        navigator.clipboard.writeText(sessionId);
    };

    return (
        <div className={styles.id}>
            <p>{sessionId}</p>
            <button className={className} onClick={onCopy} onTransitionEnd={() => setIsCopied(false)}></button>
        </div>
    )
}
