import classes from './Player.module.css'
const { Fragment } = require("react");
import handleUpdate from '../pages/index'

export function OtherPlayerDataBlock(props) {
    return (
        <Fragment> {
            <div className={ classes.playerBlock }>
                <div>
                    <p>{props.playerId}</p>
                </div>
                <div>
                    <p>{props.level}</p>
                </div>
                <div>
                    <p>{props.equipment}</p>
                </div>
                <div>
                    <p>{props.temporaryBonus}</p>
                </div>
            </div>
            }</Fragment>
    )
}