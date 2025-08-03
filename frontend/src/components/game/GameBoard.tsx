import React, { useEffect, useRef } from 'react';
import { Tile } from '../tiles/Tile';
import { Tile as TileType } from '../../types/game';
import '../tiles/Tile.css';

interface GameBoardProps {
  tiles: TileType[];
  onTileClick: (tileId: string) => void;
  className?: string;
}

export const GameBoard: React.FC<GameBoardProps> = ({ 
  tiles, 
  onTileClick, 
  className = '' 
}) => {
  const boardRef = useRef<HTMLDivElement>(null);

  // Calculate board dimensions and center point with responsive scaling
  const { width, height, centerX, centerY } = React.useMemo(() => {
    if (tiles.length === 0) {
      return { width: 0, height: 0, centerX: 0, centerY: 0 };
    }

    const maxX = Math.max(...tiles.map(tile => tile.position.x));
    const maxY = Math.max(...tiles.map(tile => tile.position.y));
    const maxZ = Math.max(...tiles.map(tile => tile.position.z));

    // Base tile size adjusted for better visibility on mobile
    const tileWidth = 60;
    const tileHeight = 60;
    const zOffset = 4;

    const width = (maxX + 1) * tileWidth + maxZ * zOffset + tileWidth;
    const height = (maxY + 1) * tileHeight + maxZ * zOffset + tileHeight;
    
    return { width, height, centerX: maxX / 2, centerY: maxY / 2 };
  }, [tiles]);

  // Auto-scroll to center the board when tiles change
  useEffect(() => {
    if (boardRef.current && tiles.length > 0) {
      const container = boardRef.current.parentElement;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const boardRect = boardRef.current.getBoundingClientRect();
        
        const scrollLeft = (boardRect.width - containerRect.width) / 2;
        const scrollTop = (boardRect.height - containerRect.height) / 2;
        
        container.scrollTo({
          left: Math.max(0, scrollLeft),
          top: Math.max(0, scrollTop),
          behavior: 'smooth'
        });
      }
    }
  }, [tiles.length]);

  return (
    <div className={`game-board-container ${className}`}>
      <div 
        ref={boardRef}
        className="game-board relative"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          minWidth: '100%',
          minHeight: '100%'
        }}
      >
        {tiles.map((tile) => {
          const distance = Math.sqrt(
            Math.pow(tile.position.x - centerX, 2) + 
            Math.pow(tile.position.y - centerY, 2)
          );
          return (
            <Tile
              key={tile.id}
              tile={tile}
              onClick={onTileClick}
              className={`tile-appear`}
              style={{
                animationDelay: `${distance * 75}ms`
              }}
            />
          );
        })}
        
        {/* Board background grid (optional visual aid) */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>
    </div>
  );
};

