const cache = {} 



const set = ( playerId, ws ) => cache[playerId] = ws;

const get = ( playerId ) => cache[playerId];  