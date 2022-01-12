import styles from './Home.module.css'


export const MainPage = ({create, join, playerId, inputRef}: {[k:string]: any}) => {
    return (
        <div className={styles.homePage}>
            <div className={styles.btngroup}>
                <button onClick={create} disabled={!playerId}>Create game</button> 
                <div className={styles.joining}>
                    <input ref={inputRef} placeholder='Enter id'></input>
                    <button onClick={join} disabled={!playerId}>Join game</button> 
                </div>
            </div>
        </div>
    );
};