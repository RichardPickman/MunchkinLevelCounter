import { Controls } from '../controls/index';
import { Home } from '../home/index';
import { sum } from './helpers/index'
import styles from './Player.module.css';

// Props is local type for your component props 
type Props = {
    onEnter: ({ key: string, value: unknown }) => void,
    onExit: ({ key: string, value: unknown }) => void,
    playerId: string, 
    isOwner: boolean,
    color: string, 
    isActive: boolean,
    level: number,
    equipment: number,
    temporaryBonus: number,
}

const Role = ({ isOwner }) => (
    <strong>
        {isOwner ? 'Власть имущий' : 'Холоп'}
    </strong>
);
 
export const Player = ({ onEnter, onExit, playerId, isOwner, color, isActive, ...props }: Props) => {
    const hasControls = !!onEnter
    
    return (
        <div className={styles.playerBlock}  style={{ width: '100%', height: '100%' }}>
            <div className={styles.player}>
                <p> Total power: <strong>{sum(props)}</strong></p>
            </div>
            {hasControls && <div className={styles.stats}>
                {Object.entries(props).map(([key, value]) => (
                <Controls name={key} value={value} onEnter={onEnter}/>
                ))}
            </div>}
            {!hasControls && <div className={styles.otherStat}>
                {Object.entries(props).map(([key, value]) => (
                <Controls name={key} value={value} onEnter={onEnter}/>
                ))}
            </div>}
            { hasControls && <div className={styles.controls}>
                <button onClick={() => onEnter({ key: 'temporaryBonus', value: 0})} className={styles.ctrl}>Next turn</button>
                <Home onExit={onExit} />
            </div>}
        </div>
    );
};
