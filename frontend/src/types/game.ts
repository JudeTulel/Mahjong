// Game type definitions for Mahjong Clone

export enum TileType {
  TRIANGLE = 'triangle',
  SQUARE = 'square',
  CIRCLE = 'circle',
  STAR = 'star',
  BIOHAZARD = 'biohazard',
  RADIOACTIVE = 'radioactive'
}

export interface Position {
  x: number;
  y: number;
  z: number; // Layer for 3D stacking
}

export interface Tile {
  id: string;
  type: TileType;
  position: Position;
  isSelected: boolean;
  isMatched: boolean;
  isBlocked: boolean; // Cannot be selected if blocked by other tiles
}

export interface GameState {
  tiles: Tile[];
  selectedTiles: Tile[];
  score: number;
  moves: number;
  timeElapsed: number;
  isGameOver: boolean;
  isWon: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  combo: number;
  lastMatchTime: number;
  comboAnnouncement: string | null;
  specialAnnouncement: string | null;
}

export interface BoardLayout {
  width: number;
  height: number;
  layers: number;
  tilePositions: Position[];
}

// Game configuration
export const GAME_CONFIG = {
  TILES_PER_TYPE: 4, // Each tile type appears 4 times (standard Mahjong rule)
  MAX_SELECTED_TILES: 2,
  BOARD_LAYOUTS: {
    easy: {
      width: 8,
      height: 6,
      layers: 2,
      totalTiles: 48
    },
    medium: {
      width: 10,
      height: 8,
      layers: 3,
      totalTiles: 72
    },
    hard: {
      width: 12,
      height: 10,
      layers: 4,
      totalTiles: 96
    }
  }
};

export type GameAction = 
  | { type: 'SELECT_TILE'; payload: { tileId: string } }
  | { type: 'DESELECT_TILE'; payload: { tileId: string } }
  | { type: 'MATCH_TILES'; payload: { tileIds: string[] } }
  | { type: 'RESET_GAME' }
  | { type: 'START_GAME'; payload: { difficulty: 'easy' | 'medium' | 'hard' } }
  | { type: 'UPDATE_TIME'; payload: { time: number } }
  | { type: 'CLEAR_SPECIAL_ANNOUNCEMENT' };

