export type PlayerId = string;

export type SessionId = string;

export type Action = string

export type Nickname = string;

export interface Player {
    playerId: PlayerId,
    isOwner: boolean,
    nickname: Nickname,
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
