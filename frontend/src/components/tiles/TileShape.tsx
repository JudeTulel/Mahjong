import React from 'react';
import { TileType } from '../../types/game';

interface TileShapeProps {
  type: TileType;
  size?: number;
  className?: string;
}

export const TileShape: React.FC<TileShapeProps> = ({ type, size = 40, className = '' }) => {
  const baseClasses = `inline-block transition-all duration-200 ${className}`;
  
  switch (type) {
    case TileType.TRIANGLE:
      return (
        <div 
          className={`${baseClasses} triangle`}
          style={{
            width: 0,
            height: 0,
            borderLeft: `${size / 2}px solid transparent`,
            borderRight: `${size / 2}px solid transparent`,
            borderBottom: `${size}px solid currentColor`,
          }}
        />
      );
      
    case TileType.SQUARE:
      return (
        <div 
          className={`${baseClasses} square bg-current`}
          style={{
            width: size,
            height: size,
          }}
        />
      );
      
    case TileType.CIRCLE:
      return (
        <div 
          className={`${baseClasses} circle bg-current rounded-full`}
          style={{
            width: size,
            height: size,
          }}
        />
      );
      
    case TileType.STAR:
      return (
        <svg 
          className={`${baseClasses} star fill-current`}
          width={size} 
          height={size} 
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
      
    case TileType.BIOHAZARD:
      return (
        <svg 
          className={`${baseClasses} biohazard fill-current`}
          width={size} 
          height={size} 
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          <circle cx="12" cy="8" r="2"/>
          <circle cx="8" cy="16" r="2"/>
          <circle cx="16" cy="16" r="2"/>
          <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          <path d="M8.5 14.5L12 12l3.5 2.5"/>
          <path d="M15.5 9.5L12 12l-3.5-2.5"/>
        </svg>
      );
      
    case TileType.RADIOACTIVE:
      return (
        <svg 
          className={`${baseClasses} radioactive fill-current`}
          width={size} 
          height={size} 
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="2"/>
          <path d="M12 4.5c-1.5 0-2.5 1-2.5 2.5h5c0-1.5-1-2.5-2.5-2.5z"/>
          <path d="M6.5 16.5c1.3-1.3 3.2-1.3 4.5 0l-2.25-3.9c-1.3.75-2.95.75-4.25 0l2 3.9z"/>
          <path d="M17.5 16.5c-1.3-1.3-3.2-1.3-4.5 0l2.25-3.9c1.3.75 2.95.75 4.25 0l-2 3.9z"/>
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
      
    default:
      return <div className={baseClasses} style={{ width: size, height: size }} />;
  }
};

