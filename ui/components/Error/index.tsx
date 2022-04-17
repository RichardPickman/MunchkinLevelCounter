import styles from './Error.module.css'


export const Error = ({ cause }) => {
    return (
        <div className={styles.error}>
            <p className={styles.message}>{ cause }</p>
        </div>
    )
};
