import { Tile, TileType, Position, GameState, BoardLayout, GAME_CONFIG } from '../types/game';

// Generate a unique ID for tiles
export const generateTileId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Shuffle array utility
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate tile set with proper distribution ensuring pairs
export const generateTileSet = (): TileType[] => {
  const tiles: TileType[] = [];
  const tileTypes = Object.values(TileType);
  
  // Add tiles in pairs to ensure matching is always possible
  const pairsNeeded = GAME_CONFIG.TILES_PER_TYPE / 2; // Should be 2 for standard Mahjong
  
  tileTypes.forEach(type => {
    for (let i = 0; i < pairsNeeded; i++) {
      // Add each tile type as a pair
      tiles.push(type, type);
    }
  });
  
  // Validate that we have an even number of each tile type
  const validation = new Map<TileType, number>();
  tiles.forEach(type => {
    validation.set(type, (validation.get(type) || 0) + 1);
  });
  
  if ([...validation.values()].some(count => count % 2 !== 0)) {
    throw new Error('Invalid tile distribution: All tiles must have a pair');
  }
  
  return shuffleArray(tiles);
};

// Generate board layout positions with traditional Mahjong patterns
export const generateBoardLayout = (difficulty: 'easy' | 'medium' | 'hard'): Position[] => {
  const config = GAME_CONFIG.BOARD_LAYOUTS[difficulty];
  const positions: Position[] = [];
  
  // Layer 0 (bottom layer) - Create base pattern
  const createBaseLayer = () => {
    const centerX = Math.floor(config.width / 2);
    const centerY = Math.floor(config.height / 2);
    
    for (let y = 1; y < config.height - 1; y++) {
      for (let x = 1; x < config.width - 1; x++) {
        // Create a more interesting pattern with gaps
        if (!(x === centerX && y === centerY)) { // Leave center empty for variation
          positions.push({ x, y, z: 0 });
        }
      }
    }
  };

  // Layer 1 - Create pyramid-like structure
  const createMiddleLayer = () => {
    const pattern = [
      [0, 1, 1, 1, 1, 0],
      [1, 1, 0, 0, 1, 1],
      [1, 0, 1, 1, 0, 1],
      [1, 1, 0, 0, 1, 1],
      [0, 1, 1, 1, 1, 0],
    ];

    const offsetX = Math.floor((config.width - pattern[0].length) / 2);
    const offsetY = Math.floor((config.height - pattern.length) / 2);

    pattern.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 1) {
          positions.push({ x: x + offsetX, y: y + offsetY, z: 1 });
        }
      });
    });
  };

  // Layer 2 and above - Create smaller patterns
  const createTopLayers = () => {
    for (let layer = 2; layer < config.layers; layer++) {
      const size = Math.max(2, Math.floor((config.width - layer * 2) / 2));
      const offsetX = Math.floor((config.width - size) / 2);
      const offsetY = Math.floor((config.height - size) / 2);

      // Create smaller patterns on top layers
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          if ((x + y) % 2 === 0) { // Checker pattern for variety
            positions.push({
              x: x + offsetX,
              y: y + offsetY,
              z: layer
            });
          }
        }
      }
    }
  };

  createBaseLayer();
  if (config.layers > 1) createMiddleLayer();
  if (config.layers > 2) createTopLayers();
  
  // Ensure we have the correct number of positions for our tiles
  return shuffleArray(positions).slice(0, config.totalTiles);
};

// Check if a board layout is solvable
const isBoardSolvable = (tiles: Tile[]): boolean => {
  const simulatedTiles = [...tiles];
  
  while (simulatedTiles.length > 0) {
    const moves = getAvailableMoves(simulatedTiles);
    if (moves.length === 0 && simulatedTiles.length > 0) {
      return false;
    }
    // Remove a random available move
    if (moves.length > 0) {
      const [tile1, tile2] = moves[Math.floor(Math.random() * moves.length)];
      const index1 = simulatedTiles.findIndex(t => t.id === tile1.id);
      const index2 = simulatedTiles.findIndex(t => t.id === tile2.id);
      simulatedTiles.splice(Math.max(index1, index2), 1);
      simulatedTiles.splice(Math.min(index1, index2), 1);
    }
  }
  return true;
};

// Create initial game board with a guaranteed solvable layout
export const createGameBoard = (difficulty: 'easy' | 'medium' | 'hard'): Tile[] => {
  const layout = generateBoardLayout(difficulty);
  let totalTiles = layout.length;

  // Ensure the layout has an even number of tiles
  if (totalTiles % 2 !== 0) {
    console.warn(
      `Layout has an odd number of tiles (${totalTiles}). Removing one tile to make it solvable.`
    );
    layout.pop();
    totalTiles--;
  }

  const pairs = totalTiles / 2;
  const allTileTypes = Object.values(TileType);
  
  let tilesToPlace: TileType[] = [];
  for (let i = 0; i < pairs; i++) {
    // Ensure we don't run out of unique tile types
    const type = allTileTypes[i % allTileTypes.length];
    tilesToPlace.push(type, type);
  }

  // Shuffle the paired tile set thoroughly
  const shuffledTiles = shuffleArray(tilesToPlace);

  const finalTiles: Tile[] = layout.map((pos, index) => ({
    id: generateTileId(),
    type: shuffledTiles[index],
    position: pos,
    isMatched: false,
    isBlocked: false,
    isSelected: false,
  }));

  return updateBlockedTiles(finalTiles);
};

// Check if a tile is blocked by other tiles using traditional Mahjong rules
export const isTileBlocked = (tile: Tile, allTiles: Tile[]): boolean => {
  const { x, y, z } = tile.position;
  
  // Check if there's a tile above this one (always blocks)
  const tileAbove = allTiles.find(t => 
    !t.isMatched && 
    t.position.x === x && 
    t.position.y === y && 
    t.position.z === z + 1
  );
  
  if (tileAbove) return true;

  // A tile is blocked if it has tiles on both left AND right sides at the same layer
  // OR if it's covered by tiles in the layer above
  
  // Check tiles in layer above (blocking area)
  const tilesAboveArea = allTiles.filter(t =>
    !t.isMatched &&
    t.position.z === z + 1 &&
    Math.abs(t.position.x - x) <= 1 && // Within 1 tile horizontally
    Math.abs(t.position.y - y) <= 1    // Within 1 tile vertically
  );
  
  if (tilesAboveArea.length >= 2) return true;
  
  // Check left and right sides (traditional Mahjong rule)
  const leftBlocked = allTiles.some(t => 
    !t.isMatched && 
    t.position.x === x - 1 && 
    t.position.y === y && 
    t.position.z === z
  );
  
  const rightBlocked = allTiles.some(t => 
    !t.isMatched && 
    t.position.x === x + 1 && 
    t.position.y === y && 
    t.position.z === z
  );
  
  return leftBlocked && rightBlocked;
};

// Update blocked status for all tiles
export const updateBlockedTiles = (tiles: Tile[]): Tile[] => {
  return tiles.map(tile => ({
    ...tile,
    isBlocked: tile.isMatched ? false : isTileBlocked(tile, tiles)
  }));
};

// Check if two tiles can be matched
export const canMatchTiles = (tile1: Tile, tile2: Tile): boolean => {
  return tile1.type === tile2.type && 
         tile1.id !== tile2.id && 
         !tile1.isBlocked && 
         !tile2.isBlocked &&
         !tile1.isMatched && 
         !tile2.isMatched;
};

// Get available moves
export const getAvailableMoves = (tiles: Tile[]): [Tile, Tile][] => {
  const availableTiles = tiles.filter(tile => !tile.isMatched && !tile.isBlocked);
  const moves: [Tile, Tile][] = [];
  
  for (let i = 0; i < availableTiles.length; i++) {
    for (let j = i + 1; j < availableTiles.length; j++) {
      if (canMatchTiles(availableTiles[i], availableTiles[j])) {
        moves.push([availableTiles[i], availableTiles[j]]);
      }
    }
  }
  
  return moves;
};

// Check if game is won
export const isGameWon = (tiles: Tile[]): boolean => {
  return tiles.every(tile => tile.isMatched);
};

// Check if game is over (no more moves available)
export const isGameOver = (tiles: Tile[]): boolean => {
  return getAvailableMoves(tiles).length === 0 && !isGameWon(tiles);
};

// Remove a specified number of matching pairs, ensuring pairs are properly removed
export const removeRandomPairs = (tiles: Tile[], pairsToRemove: number): Tile[] => {
  let updatedTiles = [...tiles];
  const availableMoves = getAvailableMoves(updatedTiles);

  if (availableMoves.length === 0) {
    return updatedTiles;
  }

  // Find all pairs of matching tiles to ensure proper pairing
  const tilePairs: Map<TileType, Tile[]> = new Map();
  updatedTiles.forEach(tile => {
    if (!tile.isMatched && !tile.isBlocked) {
      const tiles = tilePairs.get(tile.type) || [];
      tiles.push(tile);
      tilePairs.set(tile.type, tiles);
    }
  });

  // Get only types that have at least 2 tiles remaining
  const availableTypes = Array.from(tilePairs.entries())
    .filter(([_, tiles]) => tiles.length >= 2)
    .map(([type, _]) => type);

  // Remove specified number of pairs
  for (let i = 0; i < pairsToRemove && availableTypes.length > 0; i++) {
    // Get a random tile type that has available pairs
    const typeIndex = Math.floor(Math.random() * availableTypes.length);
    const tileType = availableTypes[typeIndex];
    const tiles = tilePairs.get(tileType)!;

    // Get two random tiles of this type
    const [tile1, tile2] = tiles.splice(0, 2);
    updatedTiles = updatedTiles.map(tile => 
      tile.id === tile1.id || tile.id === tile2.id 
        ? { ...tile, isMatched: true } 
        : tile
    );

    // Update available types
    if (tiles.length < 2) {
      availableTypes.splice(typeIndex, 1);
    }
    tilePairs.set(tileType, tiles);
  }

  return updateBlockedTiles(updatedTiles);
};

// Calculate combo bonus based on time between matches
export const calculateComboBonus = (lastMatchTime: number, currentTime: number): number => {
  const timeDiff = currentTime - lastMatchTime;
  if (timeDiff <= 2000) return 3; // Triple points for matches within 2 seconds
  if (timeDiff <= 4000) return 2; // Double points for matches within 4 seconds
  return 1; // Normal points
};

// Calculate score based on matches, time, and combos
export const calculateScore = (
  matches: number, 
  timeElapsed: number, 
  combo: number, 
  lastMatchTime: number
): number => {
  const currentTime = Date.now();
  const comboMultiplier = calculateComboBonus(lastMatchTime, currentTime);
  const baseScore = matches * 100;
  const comboBonus = combo * 50 * comboMultiplier;
  const timeBonus = Math.max(0, 1000 - timeElapsed);
  
  return baseScore + comboBonus + timeBonus;
};

