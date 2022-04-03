import { useRef } from 'react';
import styles from './Mainpage.module.css'


export const MainPage = ({ create, join }: { [k: string]: any }) => {
    const inputRef = useRef<HTMLInputElement>();

    return (
        <div className={styles.root}>
            <button className={styles.button} onClick={create}>Create game</button>
            <div className={styles.joining}>
                <input className={styles.input} ref={inputRef} placeholder='Enter id'></input>
                <button className={styles.button} onClick={() => join(inputRef.current.value)}>Join game</button>
            </div>
        </div>
    );
};
