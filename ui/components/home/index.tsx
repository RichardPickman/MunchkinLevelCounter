import styles from './Index.module.css'

export const Home = ({ onExit }) => {
    const returnHome = () => {
        onExit({ isActive: false })
    }

    return (
        <header className={styles.header}>
            <button onClick={returnHome} className={styles.ctrl}> Home </button>
        </header>
    )
}
