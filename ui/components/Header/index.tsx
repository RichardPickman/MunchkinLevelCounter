import styles from './Header.module.css'

export const Header = ({ children }) => {
    return (
        <header className={styles.root}>
            {children}
        </header>
    )
}
