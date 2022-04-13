export type PlayerId = string;

export type SessionId = string;

export type Nickname = string;


export interface Player {
    playerId: PlayerId,
    isOwner: boolean,
    nickname: string,
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