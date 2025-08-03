import React from 'react';

interface DifficultySelectorProps {
  onSelect: (difficulty: 'easy' | 'medium' | 'hard') => void;
  currentDifficulty?: 'easy' | 'medium' | 'hard';
  className?: string;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({ 
  onSelect, 
  currentDifficulty,
  className = '' 
}) => {
  const difficulties = [
    {
      level: 'easy' as const,
      name: 'Easy',
      description: '8×6 board, 2 layers',
      tiles: 48,
      color: 'from-green-400 to-teal-500'
    },
    {
      level: 'medium' as const,
      name: 'Medium',
      description: '10×8 board, 3 layers',
      tiles: 72,
      color: 'from-yellow-400 to-orange-500'
    },
    {
      level: 'hard' as const,
      name: 'Hard',
      description: '12×10 board, 4 layers',
      tiles: 96,
      color: 'from-red-500 to-pink-500'
    }
  ];

  return (
    <div className={`difficulty-selector ${className}`}>
      <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Choose Difficulty
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty.level}
            onClick={() => onSelect(difficulty.level)}
            className={`
              bg-gradient-to-br ${difficulty.color} text-white rounded-xl shadow-2xl 
              p-6 text-left transition-all duration-300 transform hover:scale-105 hover:shadow-cyan-400/50
              border-2 border-transparent hover:border-cyan-300
              ${currentDifficulty === difficulty.level ? 'ring-4 ring-offset-2 ring-offset-gray-900 ring-cyan-400' : ''}
            `}
          >
            <div className="text-2xl font-extrabold">{difficulty.name}</div>
            <div className="text-sm opacity-80 mt-2">{difficulty.description}</div>
            <div className="text-sm opacity-80">{difficulty.tiles} tiles</div>
          </button>
        ))}
      </div>
      
      <div className="mt-6 text-center text-gray-600 text-sm">
        <p>Select a difficulty level to start playing!</p>
        <p className="mt-2">Match pairs of identical tiles to clear the board.</p>
      </div>
    </div>
  );
};

