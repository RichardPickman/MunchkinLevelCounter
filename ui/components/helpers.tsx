import classes from './styles/Player.module.css'

const NextTurn = ({name, onClick}) => {
    const isBonus = (name === 'temporaryBonus')

    const nullifyBonus = () => onClick({ key: name, value: 0})

    return (
        <div className={classes.controls}>
            {isBonus && <button onClick={nullifyBonus}>Next turn</button>}
        </div>
    )
};

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
    let totalPower = 0
    const owner = (isOwner == true) ? <strong> Власть имущий </strong> : <strong> Холоп </strong>
    Object.entries(props).map(([key, value]) =>  totalPower += value )
    return (
        <div style={{background: color}}>
            {owner}
            <p> playerId: {playerId}</p>
            <p> Total power: <strong>{totalPower}</strong></p>
            <div>
                {Object.entries(props).map(([key, value]) => (
                <div key={key} className={ classes.playerBlock }>
                    <p>{key}: {value}</p>
                    {onClick && <Controls name={key} value={value} onClick={onClick} />}
                </div>))}
            </div>
            {Object.entries(props).map(([key]) => (
            <div>
                {onClick && <NextTurn name={key} onClick={onClick} />}
            </div>))}
        </div>
    );
};