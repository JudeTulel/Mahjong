import React from 'react';
import { useLeaderboard } from '../hooks/useMassa';
import { Difficulty } from '../types';
import './Leaderboard.css';

interface LeaderboardProps {
    difficulty: Difficulty;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ difficulty }) => {
    const { players, loading, error } = useLeaderboard(difficulty);

    if (loading) return <div className="leaderboard-loading">Loading leaderboard...</div>;
    if (error) return <div className="leaderboard-error">{error}</div>;

    return (
        <div className="leaderboard">
            <h2>{difficulty.toUpperCase()} League Leaderboard</h2>
            <div className="leaderboard-table">
                <div className="leaderboard-header">
                    <div>Rank</div>
                    <div>Address</div>
                    <div>Time</div>
                </div>
                {players.map((player, index) => (
                    <div key={player.address} className="leaderboard-row">
                        <div className={`rank ${index < players.length * 0.1 ? 'winner' : ''}`}>
                            #{index + 1}
                        </div>
                        <div className="address">
                            {player.address.slice(0, 6)}...{player.address.slice(-4)}
                        </div>
                        <div className="time">
                            {player.time}s
                        </div>
                    </div>
                ))}
                {players.length === 0 && (
                    <div className="no-players">No players yet in this league</div>
                )}
            </div>
        </div>
    );
};
