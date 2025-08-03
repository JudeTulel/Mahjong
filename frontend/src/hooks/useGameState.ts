import { useReducer, useEffect, useCallback } from 'react';
import { GameState, GameAction, Tile, TileType } from '../types/game';
import { 
  createGameBoard, 
  updateBlockedTiles, 
  canMatchTiles, 
  isGameWon, 
  isGameOver,
  calculateScore,
  removeRandomPairs
} from '../utils/gameLogic';

const initialGameState: GameState = {
  tiles: [],
  selectedTiles: [],
  score: 0,
  moves: 0,
  timeElapsed: 0,
  isGameOver: false,
  isWon: false,
  difficulty: 'easy',
  combo: 0,
  lastMatchTime: 0,
  comboAnnouncement: null,
  specialAnnouncement: null
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME': {
      const newTiles = createGameBoard(action.payload.difficulty);
      const tilesWithBlocked = updateBlockedTiles(newTiles);
      
      return {
        ...initialGameState,
        tiles: tilesWithBlocked,
        difficulty: action.payload.difficulty,
        specialAnnouncement: null
      };
    }
    
    case 'SELECT_TILE': {
      const { tileId } = action.payload;
      const tile = state.tiles.find(t => t.id === tileId);
      
      if (!tile || tile.isBlocked || tile.isMatched || tile.isSelected) {
        return state;
      }
      
      // If we already have 2 selected tiles, deselect all first
      if (state.selectedTiles.length >= 2) {
        const updatedTiles = state.tiles.map(t => ({ ...t, isSelected: false }));
        return {
          ...state,
          tiles: updatedTiles.map(t => 
            t.id === tileId ? { ...t, isSelected: true } : t
          ),
          selectedTiles: [tile]
        };
      }
      
      const updatedTiles = state.tiles.map(t => 
        t.id === tileId ? { ...t, isSelected: true } : t
      );
      
      const newSelectedTiles = [...state.selectedTiles, tile];
      
      // Check for match if we have 2 selected tiles
      if (newSelectedTiles.length === 2) {
        const [tile1, tile2] = newSelectedTiles;
        if (canMatchTiles(tile1, tile2)) {
          // Match found - remove tiles and update state
          const matchedTiles = updatedTiles.map(t => 
            (t.id === tile1.id || t.id === tile2.id) 
              ? { ...t, isMatched: true, isSelected: false }
              : { ...t, isSelected: false }
          );
          
          const tilesWithUpdatedBlocked = updateBlockedTiles(matchedTiles);
          const newMoves = state.moves + 1;
          // Combo logic: if last match was within 4 seconds, increase combo, else reset
          const now = Date.now();
          const combo = (now - state.lastMatchTime < 4000) ? state.combo + 1 : 1;
          const newScore = calculateScore(newMoves, state.timeElapsed, combo, state.lastMatchTime || now);

          let finalTiles = tilesWithUpdatedBlocked;
          let specialAnnouncement: string | null = null;

          let comboAnnouncement: string | null = null;
          if (combo >= 2) {
            let emoji = '🔥';
            if (combo >= 10) {
              emoji = '☄️';
            } else if (combo >= 5) {
              emoji = '🚀';
            }
            comboAnnouncement = `Combo x${combo} ${emoji}`;
          }

          // Special handling for combo milestones
          if (combo === 7 || combo === 14 || combo === 21 || combo === 28) {
            let pairsToRemove = 1;
            let announcement = 'Magnificent Seven! 🌟';

            if (combo === 14) {
              pairsToRemove = 2;
              announcement = 'Double Trouble! ⚡⚡';
            } else if (combo === 21) {
              pairsToRemove = 3;
              announcement = 'Triple Crown! 👑👑👑';
            } else if (combo === 28) {
              pairsToRemove = 4;
              announcement = 'Quadra Kill! 💫💫💫💫';
            }

            specialAnnouncement = announcement;
            // Find and remove pairs using our utility function
            finalTiles = removeRandomPairs(finalTiles, pairsToRemove);
          }
          
          return {
            ...state,
            tiles: finalTiles,
            selectedTiles: [],
            moves: newMoves,
            score: newScore,
            combo,
            lastMatchTime: now,
            isWon: isGameWon(finalTiles),
            isGameOver: isGameOver(finalTiles),
            comboAnnouncement,
            specialAnnouncement
          };
        } else {
          // No match - deselect tiles after a brief moment
          setTimeout(() => {
            // This will be handled by the component
          }, 1000);
        }
      }
      
      return {
        ...state,
        tiles: updatedTiles,
        selectedTiles: newSelectedTiles
      };
    }
    
    case 'DESELECT_TILE': {
      const { tileId } = action.payload;
      const updatedTiles = state.tiles.map(t => 
        t.id === tileId ? { ...t, isSelected: false } : t
      );
      
      return {
        ...state,
        tiles: updatedTiles,
        selectedTiles: state.selectedTiles.filter(t => t.id !== tileId),
        combo: 0, // reset combo on misclick or manual deselect
        comboAnnouncement: null,
        specialAnnouncement: state.combo > 2 ? 'Combo Broken 😞' : null
      };
    }
    
    case 'MATCH_TILES': {
      const { tileIds } = action.payload;
      const updatedTiles = state.tiles.map(t => 
        tileIds.includes(t.id) 
          ? { ...t, isMatched: true, isSelected: false }
          : { ...t, isSelected: false }
      );
      
      const tilesWithUpdatedBlocked = updateBlockedTiles(updatedTiles);
      const newMoves = state.moves + 1;
      const now = Date.now();
      const combo = (now - state.lastMatchTime < 4000) ? state.combo + 1 : 1;
      const newScore = calculateScore(newMoves, state.timeElapsed, combo, state.lastMatchTime || now);

      let finalTiles = tilesWithUpdatedBlocked;
      let specialAnnouncement: string | null = null;

      if (combo > 0 && combo % 7 === 0) {
        specialAnnouncement = 'Amazing! 🤩';
        const pairsToRemove = combo / 7;
        finalTiles = removeRandomPairs(finalTiles, pairsToRemove);
      }
      
      return {
        ...state,
        tiles: finalTiles,
        selectedTiles: [],
        moves: newMoves,
        score: newScore,
        combo,
        lastMatchTime: now,
        isWon: isGameWon(finalTiles),
        isGameOver: isGameOver(finalTiles),
        specialAnnouncement
      };
    }
    
    case 'UPDATE_TIME': {
      return {
        ...state,
        timeElapsed: action.payload.time
      };
    }
    
    case 'CLEAR_SPECIAL_ANNOUNCEMENT': {
      return { ...state, specialAnnouncement: null };
    }
    
    case 'RESET_GAME': {
      return initialGameState;
    }
    
    default:
      return state;
  }
};

export const useGameState = () => {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  
  // Timer effect
  useEffect(() => {
    if (gameState.tiles.length > 0 && !gameState.isGameOver && !gameState.isWon) {
      const timer = setInterval(() => {
        dispatch({ type: 'UPDATE_TIME', payload: { time: gameState.timeElapsed + 1 } });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [gameState.tiles.length, gameState.isGameOver, gameState.isWon, gameState.timeElapsed]);
  
  const startGame = useCallback((difficulty: 'easy' | 'medium' | 'hard') => {
    dispatch({ type: 'START_GAME', payload: { difficulty } });
  }, []);
  
  const selectTile = useCallback((tileId: string) => {
    dispatch({ type: 'SELECT_TILE', payload: { tileId } });
  }, []);
  
  const deselectTile = useCallback((tileId: string) => {
    dispatch({ type: 'DESELECT_TILE', payload: { tileId } });
  }, []);
  
  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const clearSpecialAnnouncement = useCallback(() => {
    dispatch({ type: 'CLEAR_SPECIAL_ANNOUNCEMENT' });
  }, []);
  
  return {
    gameState,
    startGame,
    selectTile,
    deselectTile,
    resetGame,
    clearSpecialAnnouncement
  };
};

