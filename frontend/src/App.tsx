import React, { useState, useEffect } from 'react';
import { Difficulty } from './types';
import { Leaderboard } from './components/Leaderboard';
import { LeagueStats } from './components/LeagueStats';
import { Game } from './components/game/Game';
import { WalletStatus } from './components/WalletStatus';
import { useRegisterPlayer, useLeagueInfo } from './hooks/useMassa';
import { useBearbyWallet } from './hooks/useBearbyWallet';
import './App.css';
import './components/WalletStatus.css';

function App() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const [showGame, setShowGame] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [completionTime, setCompletionTime] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const { registerPlayer, registering, error } = useRegisterPlayer();
  const { connected, installed, connect, error: walletError, clearError } = useBearbyWallet();

  const difficulties: Difficulty[] = ['easy', 'normal', 'hard'];
  const entryFees = {
    easy: BigInt(1_000_000_000),    // 1 MASSA
    normal: BigInt(2_000_000_000),  // 2 MASSA
    hard: BigInt(3_000_000_000)     // 3 MASSA
  };

  const difficultyInfo = {
    easy: { 
      fee: '1 MASSA', 
      description: 'Perfect for beginners',
      icon: '🟢'
    },
    normal: { 
      fee: '2 MASSA', 
      description: 'Balanced challenge',
      icon: '🟡'
    },
    hard: { 
      fee: '3 MASSA', 
      description: 'For experts only',
      icon: '🔴'
    }
  };

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handlePlayGame = async (difficulty: Difficulty) => {
    // Clear any previous wallet errors
    if (walletError) {
      clearError();
    }
    
    // Check if wallet is installed
    if (!installed) {
      alert('Please install the Bearby wallet extension to play. Visit https://bearby.io to download.');
      return;
    }
    
    // Connect wallet if not connected
    if (!connected) {
      const connectionSuccess = await connect();
      if (!connectionSuccess) {
        alert('Please connect your Bearby wallet to play the game.');
        return;
      }
    }
    
    // Proceed with game if wallet is connected
    setSelectedDifficulty(difficulty);
    setShowGame(true);
    setGameCompleted(false);
    setCompletionTime(0);
  };

  const handleGameComplete = async (timeInSeconds: number, difficulty: Difficulty) => {
    setCompletionTime(timeInSeconds);
    setGameCompleted(true);
    
    // Automatically submit the score to the league
    const success = await registerPlayer(
      difficulty,
      timeInSeconds,
      entryFees[difficulty]
    );

    if (success) {
      setShowSuccess(true);
    }
  };

  const handleBackToLeague = () => {
    setShowGame(false);
    setGameCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
  };

  if (showGame) {
    return (
      <div className="app">
        <header className="header">
          <div className="header-content">
            <h1>🀄 Mahjong League</h1>
            <p className="header-subtitle">
              Playing {selectedDifficulty.toUpperCase()} mode • Entry fee: {difficultyInfo[selectedDifficulty].fee}
            </p>
            <button 
              className="back-to-league-btn"
              onClick={handleBackToLeague}
            >
              ← Back to League
            </button>
          </div>
        </header>

        <div className="game-container">
          <Game 
            difficulty={selectedDifficulty}
            onGameComplete={handleGameComplete}
          />
        </div>

        {gameCompleted && (
          <div className="game-completion-overlay">
            <div className="completion-card">
              <h2>🎉 Game Completed!</h2>
              <div className="completion-stats">
                <div className="stat">
                  <span className="stat-label">Difficulty:</span>
                  <span className="stat-value">{selectedDifficulty.toUpperCase()}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Time:</span>
                  <span className="stat-value">{formatTime(completionTime)}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Entry Fee:</span>
                  <span className="stat-value">{difficultyInfo[selectedDifficulty].fee}</span>
                </div>
              </div>
              
              {registering && (
                <div className="submitting-score">
                  <span className="spinner"></span>
                  Submitting your score to the league...
                </div>
              )}
              
              {showSuccess && (
                <div className="success-message">
                  ✅ Score submitted successfully! Check the leaderboard to see your ranking.
                </div>
              )}
              
              {error && (
                <div className="error-message">
                  ❌ {error}
                </div>
              )}
              
              <div className="completion-actions">
                <button 
                  className="play-again-btn"
                  onClick={() => handlePlayGame(selectedDifficulty)}
                >
                  🎮 Play Again
                </button>
                <button 
                  className="back-to-league-btn"
                  onClick={handleBackToLeague}
                >
                  📊 View Leaderboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🀄 Mahjong League</h1>
          <p className="header-subtitle">Compete in timed Mahjong challenges and win MASSA tokens!</p>
          <WalletStatus />
        </div>
      </header>

      <div className="main-content">
        <div className="difficulty-section">
          <h2>Choose Your Challenge</h2>
          <div className="difficulty-selector">
            {difficulties.map(difficulty => (
              <button
                key={difficulty}
                className={`difficulty-btn ${selectedDifficulty === difficulty ? 'active' : ''}`}
                onClick={() => setSelectedDifficulty(difficulty)}
              >
                <span className="difficulty-icon">{difficultyInfo[difficulty].icon}</span>
                <span className="difficulty-name">{difficulty.toUpperCase()}</span>
                <span className="difficulty-fee">{difficultyInfo[difficulty].fee}</span>
                <span className="difficulty-desc">{difficultyInfo[difficulty].description}</span>
              </button>
            ))}
          </div>
          
          <div className="play-section">
            <button
              className={`play-game-btn ${!connected ? 'wallet-required' : ''}`}
              onClick={() => handlePlayGame(selectedDifficulty)}
              disabled={!installed}
            >
              {!installed ? (
                <>⚠️ Install Bearby Wallet</>
              ) : !connected ? (
                <>🔗 Connect Wallet & Play {selectedDifficulty.toUpperCase()}</>
              ) : (
                <>🎮 Play {selectedDifficulty.toUpperCase()} Game</>
              )}
            </button>
            <p className="play-info">
              {!connected ? (
                "Connect your Bearby wallet to play and compete for MASSA tokens!"
              ) : (
                "Complete the game to automatically submit your score to the league!"
              )}
            </p>
          </div>
        </div>

        <LeagueStats difficulty={selectedDifficulty} />
        <Leaderboard difficulty={selectedDifficulty} />
      </div>

      <footer className="footer">
        <p>🎮 Powered by Massa Blockchain • 🏆 Compete • 💰 Win • 🚀 Repeat</p>
      </footer>
    </div>
  );
}

export default App;

