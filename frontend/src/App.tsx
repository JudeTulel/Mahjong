import React, { useState } from 'react';
import { Difficulty } from './types';
import { Leaderboard } from './components/Leaderboard';
import { LeagueStats } from './components/LeagueStats';
import { useRegisterPlayer } from './hooks/useMassa';
import './App.css';

function App() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const [time, setTime] = useState('');
  const { registerPlayer, registering, error } = useRegisterPlayer();

  const difficulties: Difficulty[] = ['easy', 'normal', 'hard'];
  const entryFees = {
    easy: BigInt(1_000_000_000),    // 1 MASSA
    normal: BigInt(2_000_000_000),  // 2 MASSA
    hard: BigInt(3_000_000_000)     // 3 MASSA
  };

  const handleRegister = async () => {
    const timeValue = parseInt(time);
    if (isNaN(timeValue) || timeValue <= 0) {
      alert('Please enter a valid time in seconds');
      return;
    }

    const success = await registerPlayer(
      selectedDifficulty,
      timeValue,
      entryFees[selectedDifficulty]
    );

    if (success) {
      setTime('');
      alert('Successfully registered!');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Mahjong League</h1>
      </header>

      <div className="difficulty-selector">
        {difficulties.map(difficulty => (
          <button
            key={difficulty}
            className={`difficulty-btn ${selectedDifficulty === difficulty ? 'active' : ''}`}
            onClick={() => setSelectedDifficulty(difficulty)}
          >
            {difficulty.toUpperCase()}
          </button>
        ))}
      </div>

      <LeagueStats difficulty={selectedDifficulty} />

      <div className="register-section">
        <input
          type="number"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="Enter your time (seconds)"
          min="1"
        />
        <button
          className="register-btn"
          onClick={handleRegister}
          disabled={registering || !time}
        >
          {registering ? 'Registering...' : 'Register Score'}
        </button>
        {error && <div className="error-message">{error}</div>}
      </div>

      <Leaderboard difficulty={selectedDifficulty} />
    </div>
  );
}

export default App;
