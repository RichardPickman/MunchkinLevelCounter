import { useEffect, useState } from 'react'
import styles from './Clipboard.module.css'

export function Clipboard({ value }) {
    const [isCopied, setIsCopied] = useState(false);
    const classList = [styles.root, isCopied ? styles.hasAnimation : ''].join(' ');
    const onCopy = () => {
        setIsCopied(true);
        navigator.clipboard.writeText(value);
    };

    return (
        <div className={classList} onClick={onCopy} onTransitionEnd={(() => setIsCopied(false))}>
            {value}
        </div>
    )
}
