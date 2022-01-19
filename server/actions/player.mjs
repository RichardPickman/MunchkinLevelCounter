import { getPlayerId } from "../helpers.mjs";

export const getIdentifier = async () => {
    const player = getPlayerId()
    const result = { playerId: player }

    return result
};
