
export const Power = (props) => {
    let totalPower = 0
    Object.values(props).map( value =>  totalPower += value )

    return totalPower
}

export const Owner = (isOwner) => (isOwner == true) ? <strong> Власть имущий </strong> : <strong> Холоп </strong>