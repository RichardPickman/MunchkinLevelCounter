export type PlayerId = string;

export type SessionId = string;


export interface Player {
    playerId: PlayerId, 
    isOwner: boolean, 
    color: string, 
    isActive: boolean, 
    level: number, 
    equipment: number, 
    temporaryBonus: number, 
}

export interface Session {
    startTime: Date,
    sessionId: SessionId,
    players: Player[],
}