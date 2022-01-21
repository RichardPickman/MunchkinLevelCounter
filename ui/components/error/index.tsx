import styles from './Index.module.css'

const ERRORS = {
    WS: 'Not connected to WebSocket. Try Again!',
}

export const Error = ({ cause }) => {
    switch (cause) {
        case 'ws':
            return (
                <div className={styles.error}>
                    <p className={styles.message}>{ ERRORS.WS }</p>
                </div>
            )
    }
};
