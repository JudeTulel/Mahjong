import React, { useState, useEffect } from 'react';
import { useLeagueInfo, usePoolSize } from '../hooks/useMassa';
import { Difficulty } from '../types';
import './LeagueStats.css';

interface LeagueStatsProps {
    difficulty: Difficulty;
}

export const LeagueStats: React.FC<LeagueStatsProps> = ({ difficulty }) => {
    const { leagueInfo, loading: leagueLoading, error: leagueError } = useLeagueInfo(difficulty);
    const { poolSize, loading: poolLoading, error: poolError } = usePoolSize(difficulty);
    const [timeLeft, setTimeLeft] = useState<number>(0);

    // Update countdown timer
    useEffect(() => {
        if (!leagueInfo?.nextEnd) return;

        const updateTimer = () => {
            const endTime = parseInt(leagueInfo.nextEnd);
            const now = Date.now();
            const remaining = Math.max(0, endTime - now);
            setTimeLeft(remaining);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [leagueInfo?.nextEnd]);

    const formatTimeLeft = (milliseconds: number) => {
        if (milliseconds <= 0) return 'League ending...';
        
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        }
        return `${seconds}s`;
    };

    const getEntryFeeDisplay = (difficulty: Difficulty) => {
        switch (difficulty) {
            case 'easy': return '1 MASSA';
            case 'normal': return '2 MASSA';
            case 'hard': return '3 MASSA';
            default: return '0 MASSA';
        }
    };

    const loading = leagueLoading || poolLoading;
    const error = leagueError || poolError;

    if (loading) return <div className="league-stats-loading">Loading league stats...</div>;
    if (error) return <div className="league-stats-error">{error}</div>;

    return (
        <div className="league-stats">
            <h3>{difficulty.toUpperCase()} League Stats</h3>
            <div className="stats-grid">
                <div className="stat-item">
                    <div className="stat-label">Entry Fee</div>
                    <div className="stat-value">{getEntryFeeDisplay(difficulty)}</div>
                </div>
                <div className="stat-item">
                    <div className="stat-label">Current Players</div>
                    <div className="stat-value">{leagueInfo?.playerCount || 0}</div>
                </div>
                <div className="stat-item">
                    <div className="stat-label">Total Pool Size</div>
                    <div className="stat-value pool-size">{poolSize}</div>
                </div>
                <div className="stat-item">
                    <div className="stat-label">Time Left</div>
                    <div className="stat-value time-left">
                        {formatTimeLeft(timeLeft)}
                    </div>
                </div>
                <div className="stat-item">
                    <div className="stat-label">Winners Share</div>
                    <div className="stat-value">Top 10%</div>
                </div>
                <div className="stat-item">
                    <div className="stat-label">Dev Fee</div>
                    <div className="stat-value">10%</div>
                </div>
            </div>
            
            {leagueInfo?.playerCount && leagueInfo.playerCount > 0 && (
                <div className="league-info">
                    <p className="info-text">
                        🏆 Top {Math.max(1, Math.floor(leagueInfo.playerCount * 0.1))} player(s) will share the prize pool
                    </p>
                    <p className="info-text">
                        💰 Each winner gets approximately {
                            (parseFloat(poolSize.replace(' MASSA', '')) * 0.9 / Math.max(1, Math.floor(leagueInfo.playerCount * 0.1))).toFixed(2)
                        } MASSA
                    </p>
                </div>
            )}
        </div>
    );
};

