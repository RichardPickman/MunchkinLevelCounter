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
    return ["rgb(", r, ",", g, ",", b, ")"].join("");
};

export const getdbConfig = () => ({
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    hostname: process.env.DB_HOST,
    database: process.env.DB_NAME,
});