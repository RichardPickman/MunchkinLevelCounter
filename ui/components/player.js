import classes from './Player.module.css'

const Controls = ({ key,  value, onClick }) => {
    return (
    <div className={styles.controls}>
        <button onClick={()=> onClick({ key, value: value + 1})}>+</button>
        <button onClick={()=> onClick({ key, value: value - 1})}>-</button>
   </div>
    )
};


export const Player = ({onClick, playerId, props}) => {
    return (
    <div className={ classes.playerBlock }>
        <div>
            <p>{playerId}</p>
        </div>
        <div>
            {Object.entries(props).map(([key, value]) => (
                <div>
                    <p>{key}: {value}</p>
                    {onClick && <Controls key={key} value={value} onClick={onClick} />}
                </div>
            ))}
        </div>
    </div>
    )
};