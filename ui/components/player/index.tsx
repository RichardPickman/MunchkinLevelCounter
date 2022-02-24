import { Controls } from '../controls/index';
import { properData, sum } from '../helpers/helpers'
import styles from './Player.module.css';

// Props is local type for your component props 
type Props = {
    onEnter: ({ key: string, value: unknown }) => void,
    playerId: string, 
    isOwner: boolean,
    color: string, 
    isActive: boolean,
    level: number,
    equipment: number,
    temporaryBonus: number,
}
 
export const Player = ({ onEnter, playerId, isOwner, color, isActive, ...props }: Props) => {
    const hasControls = !!onEnter
    
    return (
        <div className={styles.playerBlock}  style={{ width: '100%', height: '100%' }}>
            <div className={styles.player}>
                <p> Total power: <strong>{sum(props)}</strong></p>
            </div>
            {hasControls && 
            <div className={styles.stats}>
                {Object.entries(props).map(([key, value], index) => <Controls name={key} value={value} onEnter={onEnter} key={index} />)}
            </div>}
            {!hasControls && 
            <div className={styles.otherStat}>
                {Object.entries(props).map(([key, value], index) => (
                <Controls name={key} value={value} onEnter={onEnter} key={index} />
                ))}
            </div>}
            { hasControls && <div className={styles.controls}>
                <button onClick={() => onEnter({ key: 'temporaryBonus', value: 0})} className={styles.ctrl}>Next turn</button>
            </div>}
        </div>
    );
};
