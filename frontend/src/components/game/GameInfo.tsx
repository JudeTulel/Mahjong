import React from 'react';
import { GameState } from '../../types/game';

interface GameInfoProps {
  gameState: GameState;
  onRestart: () => void;
  onNewGame: () => void;
  className?: string;
}

export const GameInfo: React.FC<GameInfoProps> = ({ 
  gameState, 
  onRestart, 
  onNewGame, 
  className = '' 
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRemainingTiles = (): number => {
    return gameState.tiles.filter(tile => !tile.isMatched).length;
  };

  const getAvailablePairs = (): number => {
    const availableTiles = gameState.tiles.filter(tile => !tile.isMatched && !tile.isBlocked);
    const tileTypes: { [key: string]: number } = {};
    
    availableTiles.forEach(tile => {
      tileTypes[tile.type] = (tileTypes[tile.type] || 0) + 1;
    });
    
    return Object.values(tileTypes).reduce((pairs, count) => pairs + Math.floor(count / 2), 0);
  };

  return (
    <div className={`game-info bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20 ${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-cyan-400">{gameState.score}</div>
          <div className="text-sm text-gray-400">Score</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-green-400">{formatTime(gameState.timeElapsed)}</div>
          <div className="text-sm text-gray-400">Time</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-400">{gameState.moves}</div>
          <div className="text-sm text-gray-400">Moves</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-400">{getRemainingTiles()}</div>
          <div className="text-sm text-gray-400">Tiles Left</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-300">Difficulty</div>
          <div className="text-sm text-gray-400 capitalize">{gameState.difficulty}</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-300">Available Pairs</div>
          <div className="text-sm text-gray-400">{getAvailablePairs()}</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-300">Selected</div>
          <div className="text-sm text-gray-400">{gameState.selectedTiles.length}/2</div>
        </div>
      </div>
      
      {/* Game status messages */}
      {gameState.isWon && (
        <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded mb-4">
          <div className="font-bold">Congratulations!</div>
          <div>You completed the game in {gameState.moves} moves and {formatTime(gameState.timeElapsed)}!</div>
        </div>
      )}
      
      {gameState.isGameOver && !gameState.isWon && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
          <div className="font-bold">Game Over</div>
          <div>No more moves available. Try again!</div>
        </div>
      )}
      
      {gameState.selectedTiles.length === 2 && (
        <div className="bg-blue-500/20 border border-blue-500 text-blue-300 px-4 py-3 rounded mb-4">
          <div className="text-sm">
            {gameState.selectedTiles[0].type === gameState.selectedTiles[1].type 
              ? "Match found! Tiles will be removed." 
              : "No match. Tiles will be deselected."}
          </div>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRestart}
          className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={gameState.tiles.length === 0}
        >
          Restart Game
        </button>
        
        <button
          onClick={onNewGame}
          className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          New Game
        </button>
      </div>
    </div>
  );
};

