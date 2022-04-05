import { useCallback, useEffect, useState } from 'react';
import styles from './Controls.module.css'

function debounce(func, timeout = 500) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), timeout);
    };
}

export const Controls = ({ name, value, onClick }) => {
    const [clicks, setClicks] = useState(0);
    const titles = { 'level': 'Level', 'equipment': 'Equipment', 'temporaryBonus': 'Bonus' };
    const hasControls = !!onClick;

    const hasLevelDown = (name === 'level' && value === 1);
    const hasLevelUp = (name === 'level' && value === 10);

    const debouncedOnClick = useCallback(debounce(onClick, 250), [value]);

    const onUp = () => {
        const newClicks = clicks + 1

        setClicks(newClicks);
        debouncedOnClick({ [name]: value + newClicks });
    };

    const onDown = () => {
        const newClicks = clicks - 1

        setClicks(newClicks);
        debouncedOnClick({ [name]: value + newClicks });
    };

    useEffect(() => setClicks(0), [value]);

    return (
        <div className={styles.root}>
            {hasControls && <button onClick={onUp} className={styles.btn} disabled={hasLevelUp}>
                <svg className={styles.svg}>
                    <use xlinkHref='./sprite.svg#up'></use>
                </svg>
            </button>}
            <div className={styles.stats}>
                <p className={styles.value_title}>{titles[`${name}`] + ':'}</p>
                <p className={styles.value}>{value + clicks}</p>
            </div>
            {hasControls && <button onClick={onDown} className={styles.btn} disabled={hasLevelDown}>
                <svg className={styles.svg}>
                    <use xlinkHref="/sprite.svg#down"></use>
                </svg>
            </button>}
        </div>
    )
};

