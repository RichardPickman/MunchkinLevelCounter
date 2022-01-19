import { Controls } from '../controls/index';
import { Home } from '../home/index';
import { Power, Owner } from './helpers/index'
import styles from './Player.module.css';
 
export const Player = ({ onClick, playerId, isOwner, color, isInside, ...props }:{[k:string]: any}) => {
    const hasControls = !!onClick
    
    return (
        <div style={{background: color}}>
            {Owner(isOwner)}
            <p> playerId: {playerId}</p>
            <p> Total power: <strong>{Power(props)}</strong></p>
            <div>
                {Object.entries(props).map(([key, value]) => (
                <div key={key} className={ styles.playerBlock }>
                    <p>{key}: {value}</p>
                    { hasControls && <Controls name={key} value={value} onClick={onClick} />}
                </div>))}
            </div>
            { hasControls && <button onClick={() => onClick({ key: 'temporaryBonus', value: 0})}>Next turn</button>}
            { hasControls && <Home onClick={onClick} />}
        </div>
    );
};