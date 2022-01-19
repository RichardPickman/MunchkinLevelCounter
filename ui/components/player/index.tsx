import { Controls } from '../controls/index';
import { Home } from '../home/index';
import { sum } from './helpers/index'
import styles from './Player.module.css';

// Props is local type for your component props 
type Props = {
    onClick: ({ key: string, value: unknown }) => void,
    playerId: string, 
    isOwner: boolean,
    color: string, 
    isInside: boolean, // @todo: find a better name
    level: number,
    equipment: number,
    temporaryBonus: number,
}

const Role = ({ isOwner }) => (
    <strong>
        {isOwner ? 'Власть имущий' : 'Холоп'}
    </strong>
);
 
export const Player = ({ onClick, playerId, isOwner, color, isInside, ...props }: Props) => {
    const hasControls = !!onClick
    
    return (
        <div style={{background: color}}>
            <Role isOwner={isOwner} />
            <p> playerId: {playerId}</p>
            <p> Total power: <strong>{sum(props)}</strong></p>
            <div>
                {Object.entries(props).map(([key, value]) => (
                    <div key={key} className={ styles.playerBlock }>
                        <p>{key}: {value}</p>
                        { hasControls && <Controls name={key} value={value} onClick={onClick} />}
                    </div>)
                )}
            </div>
            { hasControls && <button onClick={() => onClick({ key: 'temporaryBonus', value: 0})}>Next turn</button>}
            { hasControls && <Home onClick={onClick} />}
        </div>
    );
};
