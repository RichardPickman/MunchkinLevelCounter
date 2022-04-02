import { useRef } from 'react';
import styles from './Mainpage.module.css'


export const MainPage = ({ create, join }: {[k:string]: any}) => {
    const inputRef = useRef<HTMLInputElement>();

    return (
        <div className={styles.homePage}>
            <div className={styles.btngroup}>
                <button onClick={create}>Create game</button>
                <div className={styles.joining}>
                    <input ref={inputRef} placeholder='Enter id'></input>
                    <button onClick={() => join(inputRef.current.value)}>Join game</button>
                </div>
            </div>
        </div>
    );
};
