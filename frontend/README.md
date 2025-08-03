# Mahjong Clone

A modern, responsive Mahjong solitaire game built with Next.js, TypeScript, and Tailwind CSS. Features custom tile shapes including triangles, squares, circles, stars, biohazard symbols, and radioactive symbols.

## Features

### 🎮 Game Features
- **Custom Tile Shapes**: Six unique tile types with distinct visual designs
  - 🔺 Triangle (Red)
  - ⬜ Square (Green)
  - 🔵 Circle (Blue)
  - ⭐ Star (Yellow)
  - ☢️ Biohazard (Orange)
  - ☢️ Radioactive (Purple)

- **Multiple Difficulty Levels**:
  - **Easy**: 8×6 board, 2 layers, 48 tiles
  - **Medium**: 10×8 board, 3 layers, 72 tiles
  - **Hard**: 12×10 board, 4 layers, 96 tiles

- **3D Visual Effects**: Layered tile stacking with depth perception
- **Real-time Game Statistics**: Score, time, moves, and remaining tiles
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Accessibility**: Keyboard navigation and screen reader support

### 🎯 Gameplay
- Match pairs of identical tiles to remove them from the board
- Only unblocked tiles (not covered by other tiles) can be selected
- Clear all tiles to win the game
- Track your progress with score, time, and move counters

### ⌨️ Keyboard Shortcuts
- `Ctrl+R`: Restart current game
- `Ctrl+N`: Start new game
- `ESC`: Deselect all tiles
- `Tab`: Navigate between tiles
- `Enter/Space`: Select tile

## Technology Stack

- **Framework**: Next.js 15.4.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom CSS animations
- **State Management**: React useReducer hook
- **Build Tool**: Turbopack (Next.js)

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main page component
│   ├── globals.css        # Global styles
│   └── game.css           # Game-specific styles
├── components/            # React components
│   ├── game/             # Game-related components
│   │   ├── Game.tsx      # Main game component
│   │   ├── GameBoard.tsx # Game board layout
│   │   ├── GameInfo.tsx  # Game statistics panel
│   │   └── DifficultySelector.tsx # Difficulty selection
│   ├── tiles/            # Tile components
│   │   ├── Tile.tsx      # Individual tile component
│   │   ├── TileShape.tsx # Tile shape renderer
│   │   ├── Tile.css      # Tile-specific styles
│   │   └── index.ts      # Tile exports
│   └── ui/               # UI components (future expansion)
├── hooks/                # Custom React hooks
│   └── useGameState.ts   # Game state management
├── types/                # TypeScript type definitions
│   └── game.ts           # Game-related types
└── utils/                # Utility functions
    └── gameLogic.ts      # Game logic and algorithms
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd mahjong-clone
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## Game Logic

### Tile Matching Rules
- Tiles must be of the same type to match
- Only unblocked tiles can be selected
- A tile is blocked if:
  - There's another tile directly above it (higher z-layer)
  - It's surrounded by tiles on both left and right sides

### Board Generation
- Tiles are distributed randomly across the board
- Each tile type appears exactly 4 times (24 total tiles)
- Board layouts follow classic Mahjong pyramid patterns
- Higher difficulty levels have more layers and complex arrangements

### Scoring System
- Base score: 100 points per match
- Time bonus: Additional points for faster completion
- Move efficiency: Better scores for fewer moves

## Customization

### Adding New Tile Types
1. Add new type to `TileType` enum in `src/types/game.ts`
2. Implement shape in `TileShape.tsx`
3. Add styling in `Tile.css`
4. Update color scheme in `Tile.tsx`

### Modifying Difficulty Levels
Edit the `GAME_CONFIG` object in `src/types/game.ts`:
```typescript
BOARD_LAYOUTS: {
  easy: { width: 8, height: 6, layers: 2, totalTiles: 48 },
  // Add custom configurations
}
```

### Styling Customization
- **Colors**: Modify Tailwind classes in components
- **Animations**: Edit CSS animations in `src/app/game.css`
- **Layout**: Adjust grid systems and spacing in components

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Optimizations

- **React.memo**: Prevents unnecessary tile re-renders
- **CSS transforms**: Hardware-accelerated animations
- **Efficient algorithms**: Optimized tile blocking calculations
- **Lazy loading**: Components loaded on demand

## Accessibility Features

- **Keyboard Navigation**: Full game playable with keyboard
- **Screen Reader Support**: ARIA labels and roles
- **High Contrast Mode**: Automatic detection and adaptation
- **Reduced Motion**: Respects user motion preferences
- **Focus Indicators**: Clear visual focus states

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Inspired by classic Mahjong solitaire games
- Built with modern web technologies
- Designed for accessibility and performance

---

**Enjoy playing Mahjong Clone!** 🎮

