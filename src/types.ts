export interface Player {
    address: string;
    time: number;
    difficulty: string;
}

export interface LeagueInfo {
    difficulty: string;
    entryFee: string;
    nextEnd: string;
    playerCount: string;
}

export type Difficulty = 'easy' | 'normal' | 'hard';

export interface LeagueStats {
    currentPool: string;
    topPlayers: Player[];
    timeRemaining: number;
}
