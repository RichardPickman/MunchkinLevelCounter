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
        <div style={{background: color}}>
            <Role isOwner={isOwner} />  
            
            <p> playerId: {playerId}</p>
            <p> Total power: <strong>{sum(props)}</strong></p>
            <div>
                {Object.entries(props).map(([key, value]) => (
                    <div key={key} className={ styles.playerBlock }>
                        <p>{key}: {value}</p>
                        { hasControls && <Controls name={key} value={value} onClick={onEnter} />}
                    </div>
                ))}
            </div>
            { hasControls && <button onClick={() => onEnter({ key: 'temporaryBonus', value: 0})}>Next turn</button>}
            { hasControls && <Home onExit={onExit} />}
        </div>
    );
};
