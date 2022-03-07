import { Controls } from '../controls';
import { sum } from './helpers/index'
import { Player as PlayerType } from '../../types/index'
import styles from './Player.module.css';

interface Props extends PlayerType {
    onClick: (data: Partial<PlayerType>) => void
}
 
export const Player = ({ onClick, playerId, isOwner, color, isActive, ...props }: Props) => {
    const hasControls = !!onClick
    const titles = { 'level': 'Level', 'equipment': 'Equipment', 'temporaryBonus': 'Bonus' }
    
    return (
        <div className={styles.playerBlock}  style={{ width: '100%', height: '100%' }}>
            <div className={styles.player}>
                <p> Total power: <strong>{sum(props)}</strong></p>
            </div>
            { hasControls && 
            <div className={styles.stats}>
                {Object.entries(props).map(([key, value], index) => <Controls name={key} value={value} onClick={onClick} key={index} />)}
            </div>}
            { !hasControls && 
            <div className={styles.otherStat}>
                {Object.entries(props).map(([key, value], index) => (
                    <div className={styles.opponentCard} key={index}>
                        <p style={{ margin: '0px' }}>{titles[`${key}`]}</p>
                        <p>{value}</p>
                    </div>
                ))}
            </div>}
            { hasControls && <div className={styles.controls}>
                <button onClick={ () => onClick({ 'temporaryBonus': 0 }) } className={styles.ctrl}>Next turn</button>
            </div>}
        </div>
    );
};
