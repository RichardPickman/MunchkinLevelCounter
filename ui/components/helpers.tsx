import { useState } from 'react'
import classes from './Player.module.css'

const Controls = ({ name,  value, onClick }) => {
    if (value < 0) {
        value = 0
    }
    const buttonDown = <button onClick={()=> onClick({ key: name, value: value - 1})}>-</button>

    return (
    <div className={classes.controls}>
        <button onClick={()=> onClick({ key: name, value: value + 1})}>+</button>
        {(name == 'level' && value == 1 ) ? null
        :(value == 0 && name != 'level' ) ? null
        : buttonDown }
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