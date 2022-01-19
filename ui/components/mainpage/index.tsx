import { useRef } from 'react';
import styles from './Home.module.css'


export const MainPage = ({ create, join, playerId }: {[k:string]: any}) => {
    const inputRef = useRef<HTMLInputElement>();

    return (
        <div className={styles.homePage}>
            <div className={styles.btngroup}>
                <button onClick={create} disabled={!playerId}>Create game</button> 
                <div className={styles.joining}>
                    <input ref={inputRef} placeholder='Enter id'></input>
                    <button onClick={() => join(inputRef.current.value)} disabled={!playerId}>Join game</button> 
                </div>
            </div>
        </div>
    );
};