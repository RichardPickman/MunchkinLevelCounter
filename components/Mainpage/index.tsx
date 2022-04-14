import { useRef } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import styles from './Mainpage.module.css'


export const MainPage = ({ create, join }: { [k: string]: any }) => {
    const sessionIdRef = useRef<HTMLInputElement>();
    const nicknameRef = useRef<HTMLInputElement>();

    const handleAction = (type) => {
        if (nicknameRef.current.value !== '') useLocalStorage.setItem('nickname', nicknameRef.current.value)

        switch (type) {
            case 'create':
                create(useLocalStorage.getItem('nickname'));
                break;
            case 'join':
                join(sessionIdRef.current.value, useLocalStorage.getItem('nickname'));
                break;
        }
    }

    return (
        <div className={styles.root}>
            <input className={styles.input} ref={nicknameRef} title="Type your nick" placeholder='Set your nick'></input>
            <button className={styles.button} onClick={() => handleAction('create')}>Create game</button>
            <div className={styles.joining}>
                <input className={styles.input} ref={sessionIdRef} placeholder='Enter id'></input>
                <button className={styles.button} onClick={() => handleAction('join')}>Join game</button>
            </div>
        </div>
    );
};
