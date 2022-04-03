const getId = (length) => {
    let result = '';

    for (let i = 0; i < length; i++) {
        const random = Math.random();
        result += String.fromCharCode(Math.floor(random * 26) + (random < .5 ? 65 : 97));
    }

    return result;
};

export const getPlayerId = () => getId(8);

export const getSessionId = () => getId(16);

export const createPlayer = (playerId, isOwner = false) => ({
    playerId: playerId || getPlayerId(),
    isOwner,
    color: getColor(),
    level: 1,
    equipment: 0,
    temporaryBonus: 0,
    isActive: true
});

export const arrayBufferToJSON = (arrayBuffer) => {
    try {
        const data = JSON.parse(arrayBuffer.toString());

        return data;
    } catch (error) {
        return null;
    };
};

export const getUpdateFields = data => Object
    .keys(data)
    .reduce((result, key) => ({
        ...result,
        [`players.$[elem].${key}`]: data[key],
}), {});

export const getColor = () => {
    const r = Math.floor(Math.random() * 255)
    const g = Math.floor(Math.random() * 255)
    const b = Math.floor(Math.random() * 255)

    return `rgba(${r}, ${g}, ${b}, 0.2)`
};
