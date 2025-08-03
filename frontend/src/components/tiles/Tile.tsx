import React from 'react';
import { Tile as TileType } from '../../types/game';
import { TileShape } from './TileShape';

interface TileProps {
  tile: TileType;
  onClick: (tileId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Tile: React.FC<TileProps> = ({ tile, onClick, className = '', style = {} }) => {
  const handleClick = () => {
    if (!tile.isBlocked && !tile.isMatched) {
      onClick(tile.id);
    }
  };

  const getTileClasses = () => {
    const baseClasses = [
      'tile',
      'relative',
      'cursor-pointer',
      'transition-all',
      'duration-300',
      'transform',
      'border-2',
      'rounded-lg',
      'shadow-lg',
      'flex',
      'items-center',
      'justify-center',
      'select-none',
      'w-16',
      'h-16',
      'bg-white',
      'border-gray-200'
    ];

    // State-based styling
    if (tile.isMatched) {
      baseClasses.push('opacity-0', 'scale-0', 'pointer-events-none');
    } else if (tile.isBlocked) {
      baseClasses.push(
        'opacity-50',
        'cursor-not-allowed',
        'bg-gray-100',
        'border-gray-500'
      );
    } else if (tile.isSelected) {
      baseClasses.push(
        'scale-110',
        'shadow-xl',
        'border-blue-500',
        'ring-4',
        'ring-blue-300',
        'z-10'
      );
    } else {
      baseClasses.push(
        'hover:scale-105',
        'hover:shadow-xl',
        'hover:border-gray-400',
        'active:scale-95'
      );
    }

    return baseClasses.join(' ');
  };

  const getShapeColor = () => {
    if (tile.isMatched) return 'text-transparent';
    if (tile.isBlocked) return 'text-gray-500';
    
    // Color based on tile type
    switch (tile.type) {
      case 'triangle': return 'text-red-500';
      case 'square': return 'text-green-500';
      case 'circle': return 'text-blue-500';
      case 'star': return 'text-yellow-500';
      case 'biohazard': return 'text-orange-500';
      case 'radioactive': return 'text-purple-500';
      default: return 'text-gray-600';
    }
  };

  const getTileStyle = () => {
    const { x, y, z } = tile.position;
    return {
      position: 'absolute' as const,
      left: `${x * 60 + z * 4}px`,
      top: `${y * 60 + z * 4}px`,
      zIndex: z + 1,
      transform: tile.isSelected ? 'translateZ(10px)' : 'translateZ(0)',
    };
  };

  return (
    <div
      className={`${getTileClasses()} ${className}`}
      style={{...getTileStyle(), ...style}}
      onClick={handleClick}
      data-tile-id={tile.id}
      data-tile-type={tile.type}
      role="button"
      tabIndex={tile.isBlocked || tile.isMatched ? -1 : 0}
      aria-label={`${tile.type} tile at position ${tile.position.x}, ${tile.position.y}`}
      aria-disabled={tile.isBlocked || tile.isMatched}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* 3D effect shadow */}
      <div 
        className="absolute inset-0 bg-gray-400 rounded-lg -z-10"
        style={{
          transform: 'translate(4px, 4px)',
          opacity: tile.isMatched ? 0 : 0.3
        }}
      />
      
      {/* Tile content */}
      <div className={`${getShapeColor()} transition-colors duration-300`}>
        <TileShape type={tile.type} size={32} />
      </div>
      
      {/* Selection indicator */}
      {tile.isSelected && (
        <div className="absolute inset-0 border-2 border-blue-400 rounded-lg animate-pulse" />
      )}
      
      {/* Blocked overlay */}
      {tile.isBlocked && (
        <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg" />
      )}
    </div>
  );
};

