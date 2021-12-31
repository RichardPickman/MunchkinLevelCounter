import classes from './Player.module.css'
const { Fragment } = require("react");
import handleUpdate from '../pages/index'


export default function PlayerDataBlock(props) {
    return (
        <Fragment>
            {
                props.players.map((data) => (
                    <div className={ classes.playerBlock }>
                        <div>
                            <p> Your playerId is {data.playerId}</p>
                        </div>
                        <div>
                        {this == data.playerId && <button onClick={handleUpdate({ playerId, level: data.level - 1 })}> - 1</button>}
                            <p> Your level is {data.level}</p>
                        {this == data.playerId && <button onClick={handleUpdate({ playerId, level: data.level + 1 })}> + 1</button>}
                        </div>
                        <div>
                        {this == data.playerId && <button onClick={handleUpdate({ playerId, equipment: data.equipment - 1 })}> - 1</button>}
                            <p> Your equipment is {data.equipment}</p>
                        {this == data.playerId && <button onClick={handleUpdate({ playerId, equipment: data.equipment + 1 })}> + 1</button>}
                        </div>
                        <div>
                        {this == data.playerId && <button onClick={handleUpdate({ playerId, temporaryBonus: data.temporaryBonus - 1 })}> - 1</button>}
                            <p> Your temporary bonus is {data.temporaryBonus}</p>
                        {this == data.playerId && <button onClick={handleUpdate({ playerId, temporaryBonus: data.temporaryBonus + 1 })}> + 1</button>}
                        </div>
                    </div>
                ), props.gamer)
            }
        </Fragment>
    )
}