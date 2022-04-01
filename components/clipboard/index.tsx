import { useState } from 'react'
import styles from './Clipboard.module.css'

export function Clipboard({ value }) {
    const [isCopied, setIsCopied] = useState(false);
    const className = [styles.button, isCopied && styles.hasAnimation].join(' ');

    const onCopy = () => {
        setIsCopied(true);
        navigator.clipboard.writeText(value);
    };

    return (
        <div className={styles.root}>
            <p>{value}</p>
            <div
                className={className}
                onClick={onCopy}
                onTransitionEnd={() => setIsCopied(false)}
            />
        </div>
    )
}