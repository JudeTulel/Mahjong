import React from 'react';
import { useLeaderboard, useLeagueInfo } from '../hooks/useMassa';
import { Difficulty } from '../types';
import './Leaderboard.css';

interface LeaderboardProps {
    difficulty: Difficulty;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ difficulty }) => {
    const { players, loading: playersLoading, error: playersError } = useLeaderboard(difficulty);
    const { leagueInfo, loading: leagueLoading, error: leagueError } = useLeagueInfo(difficulty);

    const loading = playersLoading || leagueLoading;
    const error = playersError || leagueError;

    if (loading) return <div className="leaderboard-loading">Loading leaderboard...</div>;
    if (error) return <div className="leaderboard-error">{error}</div>;

    const totalPlayers = players.length;
    const winnersCount = Math.max(1, Math.floor(totalPlayers * 0.1));

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${seconds}s`;
    };

    const formatAddress = (address: string) => {
        return `${address.slice(0, 8)}...${address.slice(-6)}`;
    };

    const getRankDisplay = (index: number) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return `#${index + 1}`;
    };

    return (
        <div className="leaderboard">
            <div className="leaderboard-header-section">
                <h2>{difficulty.toUpperCase()} League Leaderboard</h2>
                {totalPlayers > 0 && (
                    <div className="leaderboard-summary">
                        <span className="total-players">{totalPlayers} players</span>
                        <span className="winners-info">
                            Top {winnersCount} will win prizes
                        </span>
                    </div>
                )}
            </div>
            
            <div className="leaderboard-table">
                <div className="leaderboard-table-header">
                    <div className="col-rank">Rank</div>
                    <div className="col-address">Player</div>
                    <div className="col-time">Time</div>
                    <div className="col-status">Status</div>
                </div>
                
                <div className="leaderboard-body">
                    {players.map((player, index) => {
                        const isWinner = index < winnersCount;
                        const isTopThree = index < 3;
                        
                        return (
                            <div 
                                key={`${player.address}-${player.time}`} 
                                className={`leaderboard-row ${isWinner ? 'winner' : ''} ${isTopThree ? 'top-three' : ''}`}
                            >
                                <div className="col-rank">
                                    <span className="rank-display">
                                        {getRankDisplay(index)}
                                    </span>
                                </div>
                                <div className="col-address">
                                    <span className="address-display" title={player.address}>
                                        {formatAddress(player.address)}
                                    </span>
                                </div>
                                <div className="col-time">
                                    <span className="time-display">
                                        {formatTime(player.time)}
                                    </span>
                                </div>
                                <div className="col-status">
                                    {isWinner && (
                                        <span className="winner-badge">
                                            🏆 Winner
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {players.length === 0 && (
                    <div className="no-players">
                        <div className="no-players-icon">🎮</div>
                        <div className="no-players-text">No players yet in this league</div>
                        <div className="no-players-subtext">Be the first to compete!</div>
                    </div>
                )}
            </div>
            
            {totalPlayers > 0 && (
                <div className="leaderboard-footer">
                    <div className="prize-info">
                        <h4>Prize Distribution</h4>
                        <p>
                            🏆 Top {winnersCount} player{winnersCount > 1 ? 's' : ''} share 90% of the pool
                        </p>
                        <p>
                            💼 10% goes to development fund
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

