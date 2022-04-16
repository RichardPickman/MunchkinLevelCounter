import styles from './Button.module.css'

export const Button = ({ onClick, text }) => (
    <button className={styles.root} onClick={onClick}>
        {text}
    </button>
);
