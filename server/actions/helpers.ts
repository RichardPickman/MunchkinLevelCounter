import { getColor } from "../helpers";


export const createPlayer = (playerId, isOwner = false) => ({
        playerId,
        isOwner,
        color: getColor(),
        level: 1,
        equipment: 0,
        temporaryBonus: 0,
        isActive: true
});
