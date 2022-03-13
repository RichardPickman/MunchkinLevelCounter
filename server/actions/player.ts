import { getPlayerId } from "../helpers";

export const getIdentifier = async () => {
    const player = getPlayerId()
    const result = { playerId: player }

    return result
};
