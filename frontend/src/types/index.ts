export type Difficulty = 'easy' | 'normal' | 'hard';

export interface Player {
    address: string;
    time: number;
    difficulty: Difficulty;
}

export interface LeagueInfo {
    difficulty: Difficulty;
    entryFee: string;
    nextEnd: string;
    playerCount: number;
    poolSize?: string;
}

export interface LeagueStats {
    players: Player[];
    endTime: number;
    poolSize: string;
}
