import classes from './styles/Player.module.css'

const Controls = ({ name,  value, onClick }) => {
    const isLevelDown = !(name === 'level' && value === 1)
    const isLevelUp = !(name === 'level' && value === 10)

    const onUp = () => onClick({ key: name, value: value + 1}) 
    const onDown = () => onClick({ key: name, value: value -1})

    return (
    <div className={classes.controls}>
        {isLevelUp && <button onClick={onUp}>+</button>}
        {isLevelDown && <button onClick={onDown}>-</button>}
   </div>
    )
};


export const Player = ({onClick, playerId, isOwner, color,  ...props}:{[k:string]: any}) => {
    return (
    <div className={ classes.playerBlock } style={{background: color}}>
        <div>
            <p>playerId: {playerId}</p>
        </div>
        <div>
            {Object.entries(props).map(([key, value]) => (
                <div key={key}>
                    <p>{key}: {value}</p>
                    {onClick && <Controls name={key} value={value} onClick={onClick} />}
                </div>
            ))}
        </div>
    </div>
    );
};