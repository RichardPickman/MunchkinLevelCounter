import styles from './Controls.module.css'

export const Controls = ({ name,  value, onEnter }) => {
    const isLevelDown = (name === 'level' && value === 1)
    const isLevelUp = (name === 'level' && value === 10)
    const hasControls = !!onEnter
    

    const onUp = () => onEnter({ key: name, value: value + 1}) 
    const onDown = () => onEnter({ key: name, value: value -1})
    

    return (
        <div className={styles.level}>
            <p style={{ margin: '0px' }}>{name}</p>
            { hasControls && <button onClick={onUp} className={styles.btn} disabled={isLevelUp}>
                <svg className={styles.svg}>
                    <use xlinkHref='./sprite.svg#up'></use>
                </svg>
            </button>}
            <p>{value}</p>
            { hasControls && <button onClick={onDown} className={styles.btn} disabled={isLevelDown}>
                <svg className={styles.svg}>
                    <use xlinkHref="/sprite.svg#down"></use>
                </svg>
            </button>}
        </div>
        
    )
};

