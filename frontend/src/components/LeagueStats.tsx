import React from 'react';
import { useLeagueInfo } from '../hooks/useMassa';
import { Difficulty } from '../types';
import './LeagueStats.css';

interface LeagueStatsProps {
    difficulty: Difficulty;
}

export const LeagueStats: React.FC<LeagueStatsProps> = ({ difficulty }) => {
    const { leagueInfo, loading, error } = useLeagueInfo(difficulty);

    if (loading) return <div className="league-stats-loading">Loading league stats...</div>;
    if (error) return <div className="league-stats-error">{error}</div>;
    if (!leagueInfo) return null;

    const timeLeft = new Date(parseInt(leagueInfo.nextEnd)).getTime() - Date.now();
    const minutes = Math.floor(timeLeft / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return (
        <div className="league-stats">
            <h3>{difficulty.toUpperCase()} League Stats</h3>
            <div className="stats-grid">
                <div className="stat-item">
                    <div className="stat-label">Entry Fee</div>
                    <div className="stat-value">{leagueInfo.entryFee}</div>
                </div>
                <div className="stat-item">
                    <div className="stat-label">Current Players</div>
                    <div className="stat-value">{leagueInfo.playerCount}</div>
                </div>
                <div className="stat-item">
                    <div className="stat-label">Pool Size</div>
                    <div className="stat-value">
                        {(parseInt(leagueInfo.entryFee) * leagueInfo.playerCount / 1e9).toFixed(2)} MASSA
                    </div>
                </div>
                <div className="stat-item">
                    <div className="stat-label">Time Left</div>
                    <div className="stat-value">
                        {timeLeft > 0 ? `${minutes}m ${seconds}s` : 'League ending...'}
                    </div>
                </div>
            </div>
        </div>
    );
};
