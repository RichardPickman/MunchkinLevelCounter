const cache = {} 



export const set = ( playerId, ws ) => cache[playerId] = ws;

export const get = ( playerId ) => cache[playerId];  