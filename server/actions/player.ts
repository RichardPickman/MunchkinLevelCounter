import { getPlayerId } from "../../helpers";

export const getIdentifier = () => ({ playerId: getPlayerId() });
