import styles from './Controls.module.css'

export const Controls = ({ name,  value, onClick }) => {
    const isLevelDown = !(name === 'level' && value === 1)
    const isLevelUp = !(name === 'level' && value === 10)
    

    const onUp = () => onClick({ key: name, value: value + 1}) 
    const onDown = () => onClick({ key: name, value: value -1})
    

    return (
        <div className={styles.controls}>
            {isLevelUp && <button onClick={onUp}>+</button>}
            {isLevelDown && <button onClick={onDown}>-</button>}
        </div>
    )
};