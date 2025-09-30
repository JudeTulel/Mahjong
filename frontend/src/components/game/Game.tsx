import React, { useState, useCallback, useEffect } from 'react';
import { GameBoard } from './GameBoard';
import { GameInfo } from './GameInfo';
import { DifficultySelector } from './DifficultySelector';
import { ComboAnnouncement } from '../ui/ComboAnnouncement';
import { SpecialAnnouncement } from '../ui/SpecialAnnouncement';
import { useGameState } from '../../hooks/useGameState';
import { canMatchTiles } from '../../utils/gameLogic';
import { Difficulty } from '../../types';

interface GameProps {
  difficulty?: Difficulty;
  onGameComplete?: (timeInSeconds: number, difficulty: Difficulty) => void;
}

export const Game: React.FC<GameProps> = ({ difficulty: propDifficulty, onGameComplete }) => {
  const { gameState, startGame, selectTile, deselectTile, resetGame, clearSpecialAnnouncement } = useGameState();
  const [showDifficultySelector, setShowDifficultySelector] = useState(!propDifficulty);
  const [matchTimeout, setMatchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Start game automatically if difficulty is provided
  useEffect(() => {
    if (propDifficulty && !gameState.tiles.length) {
      const mappedDifficulty = propDifficulty === 'normal' ? 'medium' : 
                              propDifficulty === 'hard' ? 'hard' : 'easy';
      startGame(mappedDifficulty);
      setShowDifficultySelector(false);
    }
  }, [propDifficulty, gameState.tiles.length, startGame]);

  // Handle game completion
  useEffect(() => {
    if (gameState.isWon && !gameCompleted && onGameComplete) {
      setGameCompleted(true);
      const difficulty = gameState.difficulty === 'medium' ? 'normal' : 
                        gameState.difficulty === 'hard' ? 'hard' : 'easy';
      onGameComplete(gameState.timeElapsed, difficulty);
    }
  }, [gameState.isWon, gameState.timeElapsed, gameState.difficulty, gameCompleted, onGameComplete]);

  // Handle tile selection with automatic deselection for non-matches
  const handleTileClick = useCallback((tileId: string) => {
    const tile = gameState.tiles.find(t => t.id === tileId);
    if (!tile || tile.isBlocked || tile.isMatched) return;

    // Clear any existing timeout
    if (matchTimeout) {
      clearTimeout(matchTimeout);
      setMatchTimeout(null);
    }

    if (tile.isSelected) {
      // Deselect if already selected
      deselectTile(tileId);
    } else {
      // Select the tile
      selectTile(tileId);
      
      // Check if we now have 2 selected tiles
      const currentSelected = gameState.selectedTiles;
      if (currentSelected.length === 1) {
        const otherTile = currentSelected[0];
        if (!canMatchTiles(tile, otherTile)) {
          // No match - deselect both tiles after a delay
          const timeout = setTimeout(() => {
            deselectTile(tile.id);
            deselectTile(otherTile.id);
            setMatchTimeout(null);
          }, 1500);
          setMatchTimeout(timeout);
        }
      }
    }
  }, [gameState.tiles, gameState.selectedTiles, selectTile, deselectTile, matchTimeout]);

  // Handle difficulty selection
  const handleDifficultySelect = (difficulty: 'easy' | 'medium' | 'hard') => {
    startGame(difficulty);
    setShowDifficultySelector(false);
    setGameCompleted(false);
  };

  // Handle game restart
  const handleRestart = () => {
    if (matchTimeout) {
      clearTimeout(matchTimeout);
      setMatchTimeout(null);
    }
    setGameCompleted(false);
    startGame(gameState.difficulty);
  };

  // Handle new game
  const handleNewGame = () => {
    if (matchTimeout) {
      clearTimeout(matchTimeout);
      setMatchTimeout(null);
    }
    resetGame();
    setGameCompleted(false);
    setShowDifficultySelector(true);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (matchTimeout) {
        clearTimeout(matchTimeout);
      }
    };
  }, [matchTimeout]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'r':
        case 'R':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handleRestart();
          }
          break;
        case 'n':
        case 'N':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handleNewGame();
          }
          break;
        case 'Escape':
          // Deselect all tiles
          gameState.selectedTiles.forEach(tile => deselectTile(tile.id));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.selectedTiles, deselectTile, handleRestart, handleNewGame]);

  if (showDifficultySelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-4xl w-full animate-slide-up">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Mahjong Clone</h1>
            <p className="text-gray-600">Match pairs of identical tiles to clear the board</p>
          </div>
          <DifficultySelector onSelect={handleDifficultySelect} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Game Info Panel */}
          <div className="lg:w-80 flex-shrink-0">
            <GameInfo 
              gameState={gameState}
              onRestart={handleRestart}
              onNewGame={handleNewGame}
            />
          </div>
          
          {/* Game Board */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              <GameBoard 
                tiles={gameState.tiles}
                onTileClick={handleTileClick}
                difficulty={gameState.difficulty}
              />
              
              {/* Combo Announcement */}
              {gameState.comboAnnouncement && (
                <ComboAnnouncement 
                  message={gameState.comboAnnouncement}
                />
              )}
              
              {/* Special Announcement */}
              {gameState.specialAnnouncement && (
                <SpecialAnnouncement 
                  announcement={gameState.specialAnnouncement}
                  onClose={clearSpecialAnnouncement}

                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

