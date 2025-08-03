import React, { useState, useEffect, useCallback } from 'react';
import { GameBoard } from './GameBoard';
import { GameInfo } from './GameInfo';
import { DifficultySelector } from './DifficultySelector';
import { ComboAnnouncement } from '../ui/ComboAnnouncement';
import { SpecialAnnouncement } from '../ui/SpecialAnnouncement';
import { useGameState } from '../../hooks/useGameState';
import { canMatchTiles } from '../../utils/gameLogic';

export const Game: React.FC = () => {
  const { gameState, startGame, selectTile, deselectTile, resetGame, clearSpecialAnnouncement } = useGameState();
  const [showDifficultySelector, setShowDifficultySelector] = useState(true);
  const [matchTimeout, setMatchTimeout] = useState<NodeJS.Timeout | null>(null);

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
  };

  // Handle game restart
  const handleRestart = () => {
    if (matchTimeout) {
      clearTimeout(matchTimeout);
      setMatchTimeout(null);
    }
    startGame(gameState.difficulty);
  };

  // Handle new game
  const handleNewGame = () => {
    if (matchTimeout) {
      clearTimeout(matchTimeout);
      setMatchTimeout(null);
    }
    resetGame();
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      {/* Combo announcement */}
      <ComboAnnouncement message={gameState.comboAnnouncement} />
      <SpecialAnnouncement 
        announcement={gameState.specialAnnouncement}
        onClose={clearSpecialAnnouncement}
      />
      {/* Header */}
      <header className="bg-white/10 shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Mahjong Mania</h1>
            <div className="text-sm text-gray-600">
              Use Ctrl+R to restart, Ctrl+N for new game, ESC to deselect
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Game Info Sidebar */}
          <div className="lg:col-span-1">
            <GameInfo
              gameState={gameState}
              onRestart={handleRestart}
              onNewGame={handleNewGame}
              className="sticky top-4"
            />
          </div>

          {/* Game Board */}
          <div className="lg:col-span-3">
            <div className="bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20 overflow-auto max-h-[80vh]">
              {gameState.tiles.length > 0 ? (
                <GameBoard
                  tiles={gameState.tiles}
                  onTileClick={handleTileClick}
                />
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <div className="text-xl mb-2">No game in progress</div>
                    <div className="text-sm">Select a difficulty to start playing</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Game Over Modal */}
      {(gameState.isWon || gameState.isGameOver) && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className={`text-6xl mb-4 ${gameState.isWon ? 'text-green-500' : 'text-red-500'}`}>
                {gameState.isWon ? '🎉🏆🥳' : '😞👎💔'}
              </div>
              <h2 className={`text-2xl font-bold mb-4 ${gameState.isWon ? 'text-green-600' : 'text-red-600'}`}>
                {gameState.isWon ? 'You are a Mahjong Master!' : 'Better Luck Next Time!'}
              </h2>
              <div className="text-gray-600 mb-6">
                {gameState.isWon ? (
                  <>
                    <p>You completed the game!</p>
                    <p className="mt-2">
                      Score: {gameState.score} | Time: {Math.floor(gameState.timeElapsed / 60)}:
                      {(gameState.timeElapsed % 60).toString().padStart(2, '0')} | Moves: {gameState.moves}
                    </p>
                  </>
                ) : (
                  <p>No more moves available. Better luck next time!</p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleRestart}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
                >
                  Play Again
                </button>
                <button
                  onClick={handleNewGame}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
                >
                  New Game
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

