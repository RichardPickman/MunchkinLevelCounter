
// general reusable helper to calc the sum
export const sum = props => Object
    .values(props)
    .map(value => Number(value))
    .reduce((total, value) => total + value, 0);
