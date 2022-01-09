
const ERROR_LOG = {
    BROWSER: "browser does not support a local storage",
    PLAYERID: "player id does not exist"
}

const IS_BROWSER_SUPPORT_STORAGE = () => {
    return (typeof(Storage) !== "undefined") ? true : false;
}

const addPlayerId = (player) => {
    localStorage.setItem("playerId", player)
    let playerId = localStorage.getItem("playerId")

    return playerId;
}

const getPlayerId = () => {
    let playerId = localStorage.getItem("playerId")

    return playerId;
}


export const handleStorage = (data) => {
    if (!IS_BROWSER_SUPPORT_STORAGE) {
        return ERROR_LOG.BROWSER;
    }
    console.log(data)

    switch (data.action) {
        case 'add':
            return addPlayerId(data.id);
        case 'get':
            return getPlayerId();
    }
}
