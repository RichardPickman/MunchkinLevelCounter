import { getColor } from "../helpers.mjs";


export const createPlayer = (playerId, isOwner = false) => ({
        playerId,
        isOwner,
        color: getColor(),
        level: 1,
        equipment: 0,
        temporaryBonus: 0,
        isInside: true
});