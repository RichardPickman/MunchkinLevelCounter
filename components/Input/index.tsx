import styles from './Input.module.css'

export const Input = ({ onChange, placeholder, value = '' }) => (
    <input
        className={styles.root}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
        value={value}
    />
);
