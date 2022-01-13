import { Controls } from '../controls/index'
import styles from './Player.module.css'
 
export const Player = ({ onClick, playerId, isOwner, color,  ...props }:{[k:string]: any}) => {
    let totalPower = 0
    const hasControls = !!onClick
    const owner = (isOwner == true) ? <strong> Власть имущий </strong> : <strong> Холоп </strong>
    Object.values(props).map(value =>  totalPower += value )
    return (
        <div style={{background: color}}>
            {owner}
            <p> playerId: {playerId}</p>
            <p> Total power: <strong>{totalPower}</strong></p>
            <div>
                {Object.entries(props).map(([key, value]) => (
                <div key={key} className={ styles.playerBlock }>
                    <p>{key}: {value}</p>
                    { hasControls && <Controls name={key} value={value} onClick={onClick} />}
                </div>))}
            </div>
            { hasControls && <button onClick={() => onClick({ key: 'temporaryBonus', value: 0})}>Next turn</button>}
        </div>
    );
};