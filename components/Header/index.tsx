import styles from './index.module.css'

export const Header = ({ children }) => {
    return (
        <header className={styles.root}>
            {children}
        </header>
    )
}