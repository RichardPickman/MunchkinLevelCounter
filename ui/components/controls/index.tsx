import styles from './Controls.module.css'

export const Controls = ({ name,  value, onClick }) => {
    const titles = { 'level': 'Level', 'equipment': 'Equipment', 'temporaryBonus': 'Bonus' }
    const isLevelDown = (name === 'level' && value === 1)
    const isLevelUp = (name === 'level' && value === 10)

    const onUp = () => onClick({[name]: value + 1}) 
    const onDown = () => onClick({[name]: value - 1})
    
    return (
        <div className={styles.level}>
            <p style={{ margin: '0px' }}>{titles[`${name}`]}</p>
            <button onClick={onUp} className={styles.btn} disabled={isLevelUp}>
                <svg className={styles.svg}>
                    <use xlinkHref='./sprite.svg#up'></use>
                </svg>
            </button>
            <p>{value}</p>
            <button onClick={onDown} className={styles.btn} disabled={isLevelDown}>
                <svg className={styles.svg}>
                    <use xlinkHref="/sprite.svg#down"></use>
                </svg>
            </button>
        </div>
    )
};

