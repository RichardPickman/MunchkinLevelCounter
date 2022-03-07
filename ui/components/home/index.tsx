import styles from './Home.module.css'

export const Home = ({ onClick }) => {
    const returnHome = () => {
        onClick({ isActive: false })
    }

    return (
        <header className={styles.header}>
            <button onClick={returnHome} className={styles.ctrl}> Home </button>
        </header>
    )
}
