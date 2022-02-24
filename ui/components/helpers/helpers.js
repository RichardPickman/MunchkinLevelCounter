
export const properData = ({ key, value }) => {
    return {[key]: value}
}

export const sum = props => Object
    .values(props)
    .map(value => Number(value))
    .reduce((total, value) => total + value, 0);
